import { Spinner } from '@blueprintjs/core';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { Classes, Icon, ITreeNode, Tooltip, Tree } from '@blueprintjs/core';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ApolloError } from 'apollo-client/errors/ApolloError';
import { useQuery } from '@apollo/react-hooks';
import { IReduxStore } from 'types';
import { loader } from 'graphql.macro';

import { Attribute } from '@arkhn/fhir.ts';

// ACTIONS
import { removeAttributesFromMap } from 'services/resourceInputs/actions';

import { NodeLabel } from './nodeLabel';
// GRAPHQL
const qStructureDisplay = loader(
  'src/graphql/queries/structureDisplay.graphql'
);
const mDeleteAttributesStartingWith = loader(
  'src/graphql/mutations/deleteAttributesStartingWith.graphql'
);

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

  const onError = (error: ApolloError): void => {
    const msg =
      error.message === 'GraphQL error: Not Authorised!'
        ? 'You only have read access on this source.'
        : error.message;
    toaster.show({
      icon: 'error',
      intent: 'danger',
      message: msg,
      timeout: 4000
    });
  };

  const [deleteAttributes] = useMutation(mDeleteAttributesStartingWith, {
    onError
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

  const findNode = (
    treeNodes: ITreeNode<Attribute>[],
    attribute: Attribute
  ): ITreeNode<Attribute> | undefined => {
    let curNode = treeNodes.find(n => attribute.isChild(n.nodeData!));
    while (curNode?.childNodes && !curNode?.nodeData!.equals(attribute)) {
      curNode = curNode!.childNodes!.find(n => attribute.isChild(n.nodeData!));
    }
    return curNode;
  };

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
    addNodeCallback?: Function,
    deleteNodeCallback?: Function
  ): ITreeNode<Attribute> => ({
    childNodes: childNodes,
    hasCaret: !attribute.isPrimitive || attribute.isArray,
    icon: attribute.isArray
      ? 'multi-select'
      : !attribute.isPrimitive
      ? 'folder-open'
      : 'tag',
    id: attribute.tail,
    label: (
      <NodeLabel
        attribute={attribute}
        addNodeCallback={addNodeCallback}
        deleteNodeCallback={deleteNodeCallback}
      />
    ),
    secondaryLabel: secondaryLabel(attribute, childNodes),
    nodeData: attribute
  });

  const deleteNodeFromArray = (
    stateNodes: ITreeNode<Attribute>[],
    attribute: Attribute
  ): ITreeNode<Attribute>[] => {
    // First, we delete all the corresponding attributes in DB
    deleteAttributes({
      variables: {
        startsWith: attribute.path
      }
    });
    // Same in Redux store
    dispatch(removeAttributesFromMap(attribute.path));

    // Then we find the parent from which we want to remove
    // the child node.
    const parent = findNode(stateNodes, attribute.parent!);
    if (!parent || !parent.childNodes) return stateNodes;

    if (parent.childNodes.length === 1) {
      // If only one child is left, we simply rebuild an empty one
      const item = new Attribute(attribute.definition);
      parent.nodeData?.addItem(item);
      parent.nodeData?.children.forEach(child =>
        item.addChild(new Attribute(child.definition))
      );
      parent.nodeData?.slices.forEach(slice =>
        item.addSlice(new Attribute(slice.definition))
      );
      parent.childNodes = [
        createNode(item, [], undefined, () =>
          setNodes(nodes => deleteNodeFromArray(nodes, item))
        )
      ];
    } else {
      // else we remove the childNode from the parent
      parent.childNodes = parent.childNodes.filter(
        child => child.id !== attribute.tail
      );
    }

    return stateNodes;
  };

  const addNodeToArray = (
    stateNodes: ITreeNode<Attribute>[],
    attribute: Attribute
  ): ITreeNode<Attribute>[] => {
    const parent = findNode(stateNodes, attribute);
    if (!parent || !parent.childNodes) return stateNodes;

    // build a new child node
    const item = new Attribute(attribute.definition);
    attribute.addItem(item);
    // if the parent array has children, add the same children to the item
    attribute.children.forEach(child =>
      item.addChild(new Attribute(child.definition))
    );
    attribute.slices.forEach(slice =>
      item.addSlice(new Attribute(slice.definition))
    );
    const newNode = createNode(
      item,
      genTreeLevel(item.children),
      undefined,
      () => setNodes(nodes => deleteNodeFromArray(nodes, item))
    );

    // add it to the parent
    parent.childNodes = [...parent.childNodes, newNode];

    return [...stateNodes];
  };

  const buildChildNodesForArray = (
    array: Attribute
  ): ITreeNode<Attribute>[] => {
    // Check if there are already existing attributes for this node
    // we extract the index from the path
    const regex = new RegExp(`^${array.path}\\[(\\d+)\\]$`);
    let existingChildrenIndices = Object.keys(attributesForResource)
      .filter(key => regex.test(key))
      .map(key => Number(regex.exec(key)![1]));

    if (existingChildrenIndices.length === 0) {
      // If no child exists yet, we still build one with index 0
      existingChildrenIndices = [0];
    }

    // create a node for each item of the array
    return existingChildrenIndices.map(childIndex => {
      array.definition.max = '1';
      let item = Attribute.from(array);
      array.addItem(item);

      return createNode(
        item,
        genTreeLevel([...item.children, ...item.slices]),
        undefined,
        () => setNodes(nodes => deleteNodeFromArray(nodes, item))
      );
    });
  };

  const buildMultiTypeNode = (attribute: Attribute): ITreeNode<Attribute>[] =>
    // create a node with a single type for each type of the parent
    attribute.spreadTypes().map(buildNodeFromAttribute);

  const buildNodeFromAttribute = (
    attribute: Attribute
  ): ITreeNode<Attribute> => {
    let childNodes: ITreeNode<Attribute>[];

    if (attribute.types.length > 1) {
      // if the attribute has multiple types, we have to create as many
      // children as there are types.
      childNodes = buildMultiTypeNode(attribute);
    } else if (attribute.isArray) {
      // If node is array, we need to replicate the root node for this type
      // childNode will be the node really having the structure defined by
      // the structure definition.
      childNodes = buildChildNodesForArray(attribute);
    } else if (attribute.slices.length > 0) {
      // if the node has slices, create a node for each of them
      childNodes = genTreeLevel(attribute.slices);
    } else if (attribute.children.length > 0) {
      // if the node has children we already know about, create them.
      childNodes = genTreeLevel(attribute.children);
    } else {
      // otherwise the node has no children for now.
      childNodes = [];
    }

    return createNode(attribute, childNodes, () =>
      setNodes(nodes => addNodeToArray(nodes, attribute))
    );
  };

  const genTreeLevel = (attributes: Attribute[]): ITreeNode<Attribute>[] =>
    attributes.map(buildNodeFromAttribute);

  const fetchAttributes = async (
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

    console.log(attribute.path, attribute, node.childNodes);
    if (!attribute.isPrimitive) {
      // if the node is of composite type, expand (or collapse) it
      node.isExpanded = !node.isExpanded;
      // if the node has no children yet, fetch the attributes definitions
      // and add them as children of the clicked node.
      if (!node.childNodes || node.childNodes.length === 0) {
        // TODO what if several types are possible?
        const children = await fetchAttributes(attribute.types[0]);
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
