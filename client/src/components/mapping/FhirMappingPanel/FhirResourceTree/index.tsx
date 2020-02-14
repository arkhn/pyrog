import { Spinner } from '@blueprintjs/core';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { Classes, Icon, ITreeNode, Tooltip, Tree } from '@blueprintjs/core';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import { IReduxStore } from 'types';
import { loader } from 'graphql.macro';

// ACTIONS
import { removeAttributesFromMap } from 'services/resourceInputs/actions';

import { Node } from './node';
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
  const { resource } = useSelector((state: IReduxStore) => state.selectedNode);
  const baseDefinitionId = resource.definition.id;

  const { data, loading } = useQuery(qStructureDisplay, {
    variables: { definitionId: baseDefinitionId }
  });
  const [deleteAttributes] = useMutation(mDeleteAttributesStartingWith);

  const [nodes, setNodes] = useState([] as ITreeNode<Node>[]);
  const [selectedNode, setSelectedNode] = useState(
    undefined as ITreeNode<Node> | undefined
  );

  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );

  const fhirStructure =
    data && data.structureDefinition ? data.structureDefinition.display : {};

  const findNode = (
    treeNodes: ITreeNode<Node>[],
    path: Node
  ): ITreeNode<Node> | undefined => {
    let curNode = treeNodes.find(n => path.isChild(n.nodeData!));
    while (curNode?.childNodes && !curNode?.nodeData!.equals(path)) {
      curNode = curNode!.childNodes!.find(n => path.isChild(n.nodeData!));
    }
    return curNode;
  };

  const checkHasChildAttributes = (pathString: string) =>
    Object.keys(attributesForResource).some(el => el.startsWith(pathString));

  const createNode = (
    path: Node,
    childNodes: ITreeNode<Node>[],
    addNodeCallback?: Function,
    deleteNodeCallback?: Function
  ): ITreeNode<Node> => {
    const hasChildAttributes = checkHasChildAttributes(path.serialize());
    const hasInputs = Object.keys(attributesForResource).includes(
      path.serialize()
    );
    const renderNodeLabel = () => {
      const nodeLabel = (
        <NodeLabel
          name={path.parent?.isArray ? path.definition.name : path.tail()}
          type={path.types.join(' | ')}
          addNodeCallback={addNodeCallback}
          deleteNodeCallback={deleteNodeCallback}
        />
      );

      if (!path.definition.definition) return nodeLabel;
      return (
        <Tooltip boundary={'viewport'} content={path.definition.definition}>
          {nodeLabel}
        </Tooltip>
      );
    };

    const renderSecondaryLabel = () => {
      if (hasInputs) return <Icon icon="small-tick" intent={'success'} />;
      else if (path.isRequired) return <Icon icon="dot" intent="warning" />;
      else if (hasChildAttributes) return <Icon icon="dot" />;
      else return null;
    };

    return {
      childNodes: childNodes,
      hasCaret: !path.isPrimitive || path.isArray,
      icon: path.isArray
        ? 'multi-select'
        : !path.isPrimitive
        ? 'folder-open'
        : 'tag',
      id: path.tail(),
      label: renderNodeLabel(),
      secondaryLabel: renderSecondaryLabel(),
      nodeData: path
    };
  };

  const deleteNodeFromArray = (
    stateNodes: ITreeNode<Node>[],
    path: Node
  ): ITreeNode<Node>[] => {
    // First, we delete all the corresponding attributes in DB
    deleteAttributes({
      variables: {
        startsWith: path.serialize()
      }
    });
    // Same in Redux store
    dispatch(removeAttributesFromMap(path.serialize()));

    // Then we find the parent from which we want to remove
    // the child node.
    const parent = findNode(stateNodes, path.parent!);
    if (!parent || !parent.childNodes) return stateNodes;

    if (parent.childNodes.length === 1) {
      // If only one child is left, we simply rebuild an empty one
      const childNode = new Node(path, path.definition, 0);
      parent.childNodes = [
        createNode(childNode, [], undefined, () =>
          setNodes(nodes => deleteNodeFromArray(nodes, childNode))
        )
      ];
    } else {
      // else we remove the childNode from the parent
      parent.childNodes = parent.childNodes.filter(
        child => child.id !== path.tail()
      );
    }

    return stateNodes;
  };

  const addNodeToArray = (
    stateNodes: ITreeNode<Node>[],
    path: Node,
    contentChildren: ITreeNode<Node>[]
  ): ITreeNode<Node>[] => {
    const parent = findNode(stateNodes, path);
    if (!parent || !parent.childNodes) return stateNodes;

    // find the last index used in the children and increment it.
    const nextIndex =
      parent.childNodes[parent.childNodes.length - 1].nodeData?.index! + 1;

    // build a new child node
    const childNode = new Node(path, path.definition, nextIndex);
    const newNode = createNode(
      childNode,
      genTreeLevel(contentChildren || [], childNode),
      undefined,
      () => setNodes(nodes => deleteNodeFromArray(nodes, childNode))
    );

    // add it to the parent
    parent.childNodes = [...parent.childNodes, newNode];

    return [...stateNodes];
  };

  const buildChildNodesForArray = (
    parent: Node,
    definition: any,
    contentChildren: ITreeNode<Node>[]
  ): ITreeNode<Node>[] => {
    // Check if there are already existing attributes for this node
    const endNodeKey = parent.serialize().length + 1;
    // We use Set to remove duplicate ids
    // we extract the index from the path
    let existingChildrenIndices = [
      ...new Set(
        Object.keys(attributesForResource)
          .filter(key => key.startsWith(parent.serialize()))
          .map(key =>
            Number(key.substring(endNodeKey, key.indexOf(']', endNodeKey)))
          )
      )
    ];

    if (existingChildrenIndices.length === 0) {
      // If no child exists yet, we still build one with index 0
      existingChildrenIndices = [0];
    }

    // create a node for each item of the array
    return existingChildrenIndices.map(childIndex => {
      const childNode = new Node(parent, definition, childIndex);
      return createNode(
        childNode,
        genTreeLevel(contentChildren || {}, childNode),
        undefined,
        () => setNodes(nodes => deleteNodeFromArray(nodes, childNode))
      );
    });
  };

  const buildMultiTypeNode = (display: any, parent: Node): ITreeNode<Node>[] =>
    // create a node with a single type for each type of the parent
    parent.types.map(type => {
      const definition = { ...display, type: [{ code: type }] };
      return buildNodeFromDefinition(definition, parent);
    });

  const buildNodeFromDefinition = (
    display: any,
    parent?: Node
  ): ITreeNode<Node> => {
    // NOTE pb in parsing, remove this when solved
    // display = display.x ? display.x : display;
    const path = new Node(parent, display);

    let childNodes: ITreeNode<Node>[];

    if (path.types.length > 1) {
      // if the node has multiple types, we have to create as many
      // children as there  are types.
      childNodes = buildMultiTypeNode(display, path!);
    } else if (path.isArray) {
      // If node is array, we need to replicate the root node for this type
      // childNode will be the node really having the structure defined by
      // the structure definition.
      childNodes = buildChildNodesForArray(path, display, display.$children);
    } else if (display.$children) {
      // if the node has children we already know about, create them.
      childNodes = genTreeLevel(display.$children, path);
    } else {
      // otherwise the node has no children for now.
      childNodes = [];
    }

    return createNode(path, childNodes, () =>
      setNodes(nodes => addNodeToArray(nodes, path, display.$children))
    );
  };

  const genTreeLevel = (display: any, parent?: Node): ITreeNode<Node>[] => {
    return (
      Object.keys(display)
        // we don't want to display the $meta attribute, filter it out
        .filter(attributeName => attributeName !== '$meta')
        .map(attributeName =>
          buildNodeFromDefinition(display[attributeName], parent)
        )
    );
  };

  const handleNodeClick = async (node: ITreeNode<Node>): Promise<void> => {
    if (node.nodeData?.isArray) {
      node.isExpanded = !node.isExpanded;
    } else if (!node.nodeData?.isPrimitive) {
      if (!node.childNodes || node.childNodes.length === 0) {
        // TODO what if several types are possible?
        const { data } = await client.query({
          query: qStructureDisplay,
          variables: { definitionId: node.nodeData?.types[0] }
        });
        if (data.structureDefinition !== null)
          node.childNodes = genTreeLevel(
            data.structureDefinition.display,
            node.nodeData!
          );
      }
      node.isExpanded = !node.isExpanded;
    } else {
      if (selectedNode) {
        selectedNode.isSelected = false;
      }
      node.isSelected = true;
      setSelectedNode(node);
      onClickCallback(node.nodeData.serialize());
    }
    setNodes([...nodes]);
  };

  // To update secondary label on user input
  const updateSecondaryLabel = (node: ITreeNode<Node>) => {
    if (!node.nodeData) return;
    const { isRequired, isArray, isPrimitive, types } = node.nodeData;
    const pathString = node.nodeData.serialize();
    const hasInputs =
      isPrimitive &&
      !isArray &&
      Object.keys(attributesForResource).includes(pathString);

    let hasChildAttributes = false;
    if (types.length > 1) {
      // Check if any of the children have child attributes@
      hasChildAttributes = node.childNodes!.some(n =>
        checkHasChildAttributes(n.nodeData!.serialize())
      );
    } else {
      hasChildAttributes = checkHasChildAttributes(pathString);
    }

    node.secondaryLabel = hasInputs ? (
      <Icon icon="small-tick" intent={'success'} />
    ) : isRequired ? (
      <Icon icon="dot" intent="warning" />
    ) : hasChildAttributes ? (
      <Icon icon="dot" />
    ) : null;

    if (node.childNodes !== undefined) {
      for (const child of node.childNodes) {
        updateSecondaryLabel(child);
      }
    }
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
