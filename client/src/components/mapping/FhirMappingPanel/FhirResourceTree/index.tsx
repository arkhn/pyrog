import { Spinner } from '@blueprintjs/core';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { Classes, ITreeNode, Tree } from '@blueprintjs/core';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import {
  IReduxStore,
  IStructureDefinition,
  IAttributeDefinition,
  IAttribute
} from 'types';
import { loader } from 'graphql.macro';

import { Attribute } from '@arkhn/fhir.ts';

// ACTIONS
import { removeAttributesFromMap } from 'services/resourceInputs/actions';
import { onError } from 'services/apollo';

import { TreeNode } from './treeNode';
// GRAPHQL
const qStructureDisplay = loader(
  'src/graphql/queries/structureDisplay.graphql'
);
const mDeleteAttributesStartingWith = loader(
  'src/graphql/mutations/deleteAttributesStartingWith.graphql'
);

const escapeRegExp = (str: string) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string

export interface Props {
  onClickCallback: any;
}

const FhirResourceTree = ({ onClickCallback }: Props) => {
  const client = useApolloClient();
  const dispatch = useDispatch();

  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const { resource, attribute: selectedAttribute } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );
  const baseDefinitionId = resource.definition.id;

  const { data, loading } = useQuery(qStructureDisplay, {
    variables: { definitionId: baseDefinitionId }
  });

  const [deleteAttributes] = useMutation(mDeleteAttributesStartingWith, {
    onError: onError(toaster)
  });

  const [nodes, setNodes] = useState([] as TreeNode[]);
  const [selectedNode, setSelectedNode] = useState(
    undefined as TreeNode | undefined
  );

  const attributesForResource: { [k: string]: IAttribute } = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );

  const buildAttributes = ({ attribute, extensions }: IAttributeDefinition) => {
    const a = Attribute.from(attribute);
    a.extensions = extensions as any;
    return a;
  };

  const fhirStructure: Attribute[] =
    data && data.structureDefinition
      ? data.structureDefinition.attributes.map(buildAttributes)
      : [];

  const itemsOf = (array: Attribute): { [index: string]: IAttribute } => {
    // Check if there are already existing attributes for this node
    // we extract the index from the path
    const regex = new RegExp(`^${escapeRegExp(array.path)}\\[(\\d+)\\]$`);
    return Object.keys(attributesForResource)
      .filter(key => regex.test(key))
      .reduce(
        (acc: any, key: string) => ({
          ...acc,
          [regex.exec(key)![1]]: attributesForResource[key]
        }),
        {}
      );
  };

  const createNode = (
    attribute: Attribute,
    childNodes: TreeNode[],
    parentArray?: TreeNode
  ): TreeNode => {
    const node = new TreeNode(
      attribute,
      childNodes,
      addExtension,
      addNodeToArray,
      deleteNodeFromArray,
      genTreeLevel,
      attributesForResource,
      parentArray
    );
    if (!!selectedAttribute && attribute.path === selectedAttribute.path) {
      node.isSelected = true;
      setSelectedNode(node);
    }
    return node;
  };

  const addExtension = (
    node: TreeNode,
    extensionDefinition: IStructureDefinition
  ) => {
    // TODO: handle primitive extensions
    if (node.nodeData.isPrimitive) {
      toaster.show({
        icon: 'error',
        intent: 'danger',
        message: 'adding extensions to primitive types is not handled yet',
        timeout: 4000
      });
      return;
    }

    let extensionArrayNode = node.childNodes!.find(
      child => child.nodeData!.isExtension
    );
    if (!extensionArrayNode) {
      const extAttr = node.nodeData.children.find(c => c.isExtension);
      extensionArrayNode = createNode(extAttr!, []);
      node.childNodes = [...node.childNodes!, extensionArrayNode];
    }

    const extensionNode = (extensionArrayNode as TreeNode).addExtension(
      extensionDefinition
    );

    node.isExpanded = true;
    extensionArrayNode.isExpanded = true;
    extensionNode!.isExpanded = true;
    if (selectedNode) selectedNode.isSelected = false;
    extensionNode!.isSelected = true;
    setSelectedNode(extensionNode);

    setNodes(nodes => [...nodes]);
  };

  const deleteNodeFromArray = (deletedNode: TreeNode, arrayNode: TreeNode) => {
    // First, we delete all the corresponding attributes in DB
    const deleted = deletedNode.nodeData!;
    deleteAttributes({
      variables: {
        startsWith: deleted.path
      }
    });
    // Same in Redux store
    dispatch(removeAttributesFromMap(deleted.path));
    // and remove the item in the parent attribute as well
    arrayNode.removeItem(deletedNode);
    //update the nodes in state
    setNodes(nodes => [...nodes]);
  };

  const addNodeToArray = (arrayNode: TreeNode) => {
    // add it to the parent
    arrayNode.addItem();
    setNodes(nodes => [...nodes]);
  };

  const buildChildNodesForArray = (arrayNode: TreeNode): TreeNode[] => {
    const array = arrayNode.nodeData!;

    let existingItems = itemsOf(array);
    // If no child exists yet, we still build one with index 0
    if (Object.keys(existingItems).length === 0) {
      existingItems = { '0': null as any };
    }
    // create a node for each item of the array
    return Object.keys(existingItems).map(index =>
      array.isExtension
        ? arrayNode.addExtension(
            { id: existingItems[index].definitionId, attributes: [] },
            Number(index)
          )!
        : arrayNode.addItem(Number(index))
    );
  };

  const buildMultiTypeNode = (attribute: Attribute): TreeNode[] =>
    // create a node with a single type for each type of the parent
    attribute
      .spreadTypes()
      .map(buildNodeFromAttribute)
      .filter(Boolean) as TreeNode[];

  const buildNodeFromAttribute = (attribute: Attribute): TreeNode | null => {
    const node = createNode(attribute, []);

    if (attribute.types.length > 1) {
      // if the attribute has multiple types, we have to create as many
      // children as there are types.
      node.childNodes = buildMultiTypeNode(attribute);
    } else if (attribute.isArray) {
      // if the node is an array of extensions, only render it if it already has children.
      if (attribute.isExtension && Object.keys(itemsOf(attribute)).length === 0)
        return null;
      // If node is array, we need to replicate the root node for this type
      // childNode will be the node really having the structure defined by
      // the structure definition.
      node.childNodes = buildChildNodesForArray(node);
    } else if (attribute.slices.length > 0) {
      // if the node has slices, create a node for each of them
      node.childNodes = genTreeLevel(attribute.slices);
    } else if (attribute.children.length > 0) {
      // if the node has children we already know about, create them.
      node.childNodes = genTreeLevel(attribute.children);
    }

    return node;
  };

  const genTreeLevel = (attributes: Attribute[]): TreeNode[] =>
    attributes.map(buildNodeFromAttribute).filter(Boolean) as TreeNode[];

  const fetchAttributeDefinition = async (
    definitionId: string
  ): Promise<Attribute[]> => {
    const { data } = await client.query({
      query: qStructureDisplay,
      variables: { definitionId }
    });
    if (!data || !data.structureDefinition) return [];
    return data.structureDefinition.attributes.map(buildAttributes);
  };

  const handleNodeClick = async (node: ITreeNode<Attribute>): Promise<void> => {
    const attribute = node.nodeData!;
    console.debug(attribute.path);
    if (attribute.isArray || !attribute.isPrimitive) {
      // if the node is of composite or array type, expand (or collapse) it
      node.isExpanded = !node.isExpanded;
      // if the node has no children yet, fetch the attributes definitions
      // and add them as children of the clicked node.
      if (!node.childNodes || node.childNodes.length === 0) {
        const children = await fetchAttributeDefinition(attribute.types[0]);
        children.forEach(child => attribute.addChild(child));
        node.childNodes = genTreeLevel(attribute.children);
      }
    } else {
      if (selectedNode && selectedNode !== node)
        selectedNode.isSelected = false;

      // select or deselect the node
      if (node.isSelected) {
        node.isSelected = false;
        setSelectedNode(undefined);
        onClickCallback(undefined);
      } else {
        node.isSelected = true;
        setSelectedNode(node as TreeNode);
        onClickCallback(node.nodeData);
      }
    }
    setNodes([...nodes]);
  };

  const handleContextMenu = async (
    node: ITreeNode<Attribute>
  ): Promise<void> => {
    const attribute = node.nodeData!;
    if (
      (attribute.isArray || !attribute.isPrimitive) &&
      (!node.childNodes || node.childNodes.length === 0)
    ) {
      const children = await fetchAttributeDefinition(attribute.types[0]);
      children.forEach(child => attribute.addChild(child));
      node.childNodes = genTreeLevel(attribute.children);
    }
    setNodes([...nodes]);
  };

  useEffect(() => {
    setNodes(nodes => {
      nodes.forEach(n => n.updateSecondaryLabel());
      return [...nodes];
    });
  }, [attributesForResource]);

  useEffect(() => {
    if (!loading) setNodes(genTreeLevel(fhirStructure));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, loading]);

  return loading ? (
    <Spinner />
  ) : (
    <Tree
      className={Classes.ELEVATION_0}
      contents={nodes}
      onNodeClick={handleNodeClick}
      onNodeContextMenu={handleContextMenu}
      onNodeCollapse={handleNodeClick}
      onNodeExpand={handleNodeClick}
    />
  );
};

export default FhirResourceTree;
