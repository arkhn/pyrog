import { Spinner } from '@blueprintjs/core';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { Classes, Icon, ITreeNode, Tree } from '@blueprintjs/core';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import { IReduxStore } from 'types';
import { loader } from 'graphql.macro';

import { Attribute } from '@arkhn/fhir.ts';

// ACTIONS
import { removeAttributesFromMap } from 'services/resourceInputs/actions';
import { onError } from 'services/apollo';

import { NodeLabel } from './nodeLabel';
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
  const { resource } = useSelector((state: IReduxStore) => state.selectedNode);
  const baseDefinitionId = resource.definition.id;

  const { data, loading } = useQuery(qStructureDisplay, {
    variables: { definitionId: baseDefinitionId }
  });

  const [deleteAttributes] = useMutation(mDeleteAttributesStartingWith, {
    onError: onError(toaster)
  });

  const [nodes, setNodes] = useState([] as ITreeNode<Attribute>[]);
  const [selectedNode, setSelectedNode] = useState(
    undefined as ITreeNode<Attribute> | undefined
  );

  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );

  const fhirStructure: Attribute[] =
    data && data.structureDefinition
      ? data.structureDefinition.attributes.map(Attribute.from)
      : [];

  const checkHasChildAttributes = (pathString: string) =>
    Object.keys(attributesForResource).some(el => el.startsWith(pathString));

  const checkHasAttribute = (pathString: string) =>
    Object.keys(attributesForResource).includes(pathString);

  const secondaryLabel = (
    attribute: Attribute,
    childNodes: ITreeNode<Attribute>[]
  ): React.ReactElement | null => {
    const hasInputs = checkHasAttribute(attribute.path);

    let hasChildAttributes: boolean;
    if (attribute.types.length > 1) {
      // Check if any of the children have child attributes
      hasChildAttributes = childNodes.some(n =>
        checkHasChildAttributes(n.nodeData!.path)
      );
    } else {
      hasChildAttributes = checkHasChildAttributes(attribute.path);
    }

    if (hasInputs && attribute.isPrimitive)
      return <Icon icon="small-tick" intent={'success'} />;
    else if (attribute.isRequired) return <Icon icon="dot" intent="warning" />;
    else if (hasChildAttributes || hasInputs) return <Icon icon="dot" />;
    else return null;
  };

  // To update secondary label on user input
  const updateSecondaryLabel = (node: ITreeNode<Attribute>) => {
    if (!node.nodeData) return;
    node.secondaryLabel = secondaryLabel(node.nodeData, node.childNodes || []);
    node.childNodes?.forEach(child => updateSecondaryLabel(child));
  };

  const createNode = (
    attribute: Attribute,
    childNodes: ITreeNode<Attribute>[],
    parentArray?: ITreeNode<Attribute>
  ): ITreeNode<Attribute> => {
    const node: ITreeNode<Attribute> = {
      childNodes: childNodes,
      hasCaret: !attribute.isPrimitive || attribute.isArray,
      icon: attribute.isArray
        ? 'multi-select'
        : !attribute.isPrimitive
        ? 'folder-open'
        : 'tag',
      id: attribute.tail,
      secondaryLabel: secondaryLabel(attribute, childNodes),
      nodeData: attribute,
      label: ''
    };
    node.label = (
      <NodeLabel
        attribute={attribute}
        addNodeCallback={() => addNodeToArray(node)}
        deleteNodeCallback={() => deleteNodeFromArray(node, parentArray!)}
      />
    );
    return node;
  };

  const deleteNodeFromArray = (
    deletedNode: ITreeNode<Attribute>,
    arrayNode: ITreeNode<Attribute>
  ) => {
    // First, we delete all the corresponding attributes in DB
    const deleted = deletedNode.nodeData!;
    const array = arrayNode.nodeData!;
    deleteAttributes({
      variables: {
        startsWith: deleted.path
      }
    });
    // Same in Redux store
    dispatch(removeAttributesFromMap(deleted.path));
    // and remove the item in the parent attribute as well
    array.removeItem(deleted);

    if (arrayNode.childNodes?.length === 1) {
      // If only one child is left, we simply rebuild an empty one
      arrayNode.childNodes = [newItemNode(arrayNode)];
    } else {
      // else we remove the childNode from the parent
      arrayNode.childNodes = arrayNode.childNodes?.filter(
        child => child.id !== deleted.tail
      );
    }

    setNodes(nodes => [...nodes]);
  };

  const newItemNode = (arrayNode: ITreeNode<Attribute>, index?: number) => {
    const array = arrayNode.nodeData!;
    const item = array.addItem(index);

    const node = createNode(
      item,
      genTreeLevel([...item.children, ...item.slices]),
      arrayNode
    );
    return node;
  };

  const addNodeToArray = (arrayNode: ITreeNode<Attribute>) => {
    // add it to the parent
    arrayNode.childNodes = [...arrayNode.childNodes!, newItemNode(arrayNode)];
    setNodes(nodes => [...nodes]);
  };

  const buildChildNodesForArray = (
    arrayNode: ITreeNode<Attribute>
  ): ITreeNode<Attribute>[] => {
    const array = arrayNode.nodeData!;
    // Check if there are already existing attributes for this node
    // we extract the index from the path

    const regex = new RegExp(`^${escapeRegExp(array.path)}\\[(\\d+)\\]$`);
    let existingChildrenIndices = Object.keys(attributesForResource)
      .filter(key => regex.test(key))
      .map(key => Number(regex.exec(key)![1]));

    if (existingChildrenIndices.length === 0) {
      // If no child exists yet, we still build one with index 0
      existingChildrenIndices = [0];
    }

    // create a node for each item of the array
    return existingChildrenIndices.map(childIndex =>
      newItemNode(arrayNode, childIndex)
    );
  };

  const buildMultiTypeNode = (attribute: Attribute): ITreeNode<Attribute>[] =>
    // create a node with a single type for each type of the parent
    attribute.spreadTypes().map(buildNodeFromAttribute);

  const buildNodeFromAttribute = (
    attribute: Attribute
  ): ITreeNode<Attribute> => {
    const node = createNode(attribute, []);

    if (attribute.types.length > 1) {
      // if the attribute has multiple types, we have to create as many
      // children as there are types.
      node.childNodes = buildMultiTypeNode(attribute);
    } else if (attribute.isArray) {
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

  const genTreeLevel = (attributes: Attribute[]): ITreeNode<Attribute>[] =>
    attributes.map(buildNodeFromAttribute);

  const fetchAttributeDefinition = async (
    definitionId: string
  ): Promise<Attribute[]> => {
    const { data } = await client.query({
      query: qStructureDisplay,
      variables: { definitionId }
    });
    if (!data || !data.structureDefinition) return [];
    return data.structureDefinition.attributes.map(Attribute.from);
  };

  const handleNodeClick = async (node: ITreeNode<Attribute>): Promise<void> => {
    const attribute = node.nodeData!;
    console.debug(attribute.path);
    if (!attribute.isPrimitive) {
      // if the node is of composite type, expand (or collapse) it
      node.isExpanded = !node.isExpanded;
      // if the node has no children yet, fetch the attributes definitions
      // and add them as children of the clicked node.
      if (!node.childNodes || node.childNodes.length === 0) {
        const children = await fetchAttributeDefinition(attribute.types[0]);
        children.forEach(child => attribute.addChild(child));
        node.childNodes = genTreeLevel(attribute.children);
      }
    } else {
      if (selectedNode) selectedNode.isSelected = false;
      node.isSelected = true;
      setSelectedNode(node);
      onClickCallback(node.nodeData);
    }
    setNodes([...nodes]);
  };

  useEffect(() => {
    setNodes(nodes => {
      for (const node of nodes) {
        updateSecondaryLabel(node);
      }
      return [...nodes];
    });
  }, [attributesForResource]);

  useEffect(() => {
    if (!loading) setNodes(genTreeLevel(fhirStructure));
  }, [resource, loading]);

  return loading ? (
    <Spinner />
  ) : (
    <Tree
      className={Classes.ELEVATION_0}
      contents={nodes}
      onNodeClick={handleNodeClick}
      onNodeCollapse={handleNodeClick}
      onNodeExpand={handleNodeClick}
    />
  );
};

export default FhirResourceTree;
