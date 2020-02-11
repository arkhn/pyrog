import { Spinner } from '@blueprintjs/core';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import {
  Classes,
  ContextMenu,
  Icon,
  ITreeNode,
  Menu,
  MenuItem,
  Tooltip,
  Tree
} from '@blueprintjs/core';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import { IReduxStore } from 'types';
import { loader } from 'graphql.macro';

// ACTIONS
import { removeAttributesFromMap } from 'services/resourceInputs/actions';

// GRAPHQL
const qStructureDisplay = loader(
  'src/graphql/queries/structureDisplay.graphql'
);
const mDeleteAttributesStartingWith = loader(
  'src/graphql/mutations/deleteAttributesStartingWith.graphql'
);

const primitiveTypes = [
  'base64Binary',
  'boolean',
  'canonical',
  'code',
  'date',
  'dateTime',
  'decimal',
  'id',
  'instant',
  'integer',
  'markdown',
  'oid',
  'positiveInt',
  'string',
  'time',
  'unsignedInt',
  'uri',
  'url',
  'uuid',
  'xhtml'
];

interface NodeData {
  types: string[];
  isArray: boolean;
  isPrimitive: boolean;
  isRequired: boolean;
  path: string[];
}

export interface Props {
  onClickCallback: any;
}

interface NodeLabelProps {
  name: string;
  type: any;
  addNodeCallback: any;
  deleteNodeCallback: any;
}

const NodeLabel = ({
  name,
  type,
  addNodeCallback,
  deleteNodeCallback
}: NodeLabelProps) => {
  const showContextMenu = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const menu = addNodeCallback ? (
      <Menu>
        <MenuItem
          icon={'add'}
          onClick={addNodeCallback}
          text={'Ajouter un item'}
        />
      </Menu>
    ) : deleteNodeCallback ? (
      <Menu>
        <MenuItem
          icon={'delete'}
          onClick={deleteNodeCallback}
          text={"Supprimer l'item"}
        />
      </Menu>
    ) : null;

    if (menu) {
      ContextMenu.show(menu, { left: e.clientX, top: e.clientY });
    }
  };

  // TODO what if several types?
  return (
    <div className={'node-label'} onContextMenu={showContextMenu}>
      <div>{name}</div>
      <div className={'node-type'}>{type}</div>
    </div>
  );
};

const FhirResourceTree = ({ onClickCallback }: Props) => {
  const client = useApolloClient();
  const dispatch = useDispatch();
  const resource = useSelector(
    (state: IReduxStore) => state.selectedNode.resource
  );
  const baseDefinitionId = resource.definition.id;

  const { data, loading } = useQuery(qStructureDisplay, {
    variables: { definitionId: baseDefinitionId }
  });
  const [deleteAttributes] = useMutation(mDeleteAttributesStartingWith);

  const [nodes, setNodes] = useState([] as ITreeNode<NodeData>[]);
  const [selectedNode, setSelectedNode] = useState([] as number[]);

  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );

  const fhirStructure =
    data && data.structureDefinition ? data.structureDefinition.display : {};

  const findNode = (
    nodes: ITreeNode<NodeData>[],
    path: string[]
  ): ITreeNode<NodeData> | undefined => {
    let curNode = nodes.find(n => n.id === path[0]);
    for (const step of path.slice(1)) {
      curNode = curNode!.childNodes!.find(n => n.id === step);
    }
    return curNode;
  };

  const findNodeWithNumberPath = (
    nodes: ITreeNode<NodeData>[],
    path: number[]
  ): ITreeNode<NodeData> => {
    let curNode = nodes[path[0]];
    for (const step of path.slice(1)) {
      curNode = curNode!.childNodes![step];
    }
    return curNode;
  };

  const buildStringFromPath = (path: string[]) => {
    return path.filter(attr => !attr.endsWith('[x]')).join('.');
  };

  const deleteNodeFromArray = (
    stateNodes: ITreeNode<NodeData>[],
    path: string[]
  ): ITreeNode<NodeData>[] => {
    // First, we delete all the corresponding attributes in DB
    deleteAttributes({
      variables: {
        startsWith: buildStringFromPath(path)
      }
    });
    // Same in Redux store
    dispatch(removeAttributesFromMap(buildStringFromPath(path)));

    // Then we delete the node from the tree
    const targetId = path.splice(-1)[0];
    const parent = findNode(stateNodes, path);
    if (!parent || !parent.childNodes) return stateNodes;

    if (parent.childNodes.length === 1) {
      // If only one child is left, we simply rebuild an empty one
      const deleteNodeCallback = (): void =>
        setNodes(nodes => deleteNodeFromArray(nodes, [...path, '0']));

      const nodeLabel = (
        <NodeLabel
          name={parent.id as string}
          type={parent.nodeData?.types[0]}
          addNodeCallback={null}
          deleteNodeCallback={deleteNodeCallback}
        />
      );

      const newNode: ITreeNode<NodeData> = {
        hasCaret: parent.childNodes[0].hasCaret,
        icon: parent.childNodes[0].icon,
        id: '0',
        isExpanded: false,
        isSelected: false,
        label: nodeLabel,
        nodeData: {
          ...parent.childNodes[0].nodeData!,
          path: [...path, '0']
        }
      };
      parent.childNodes = [newNode];
    } else {
      const targetIndex = parent.childNodes.findIndex(n => n.id === targetId);
      parent.childNodes.splice(targetIndex, 1);
    }

    return stateNodes;
  };

  const addNodeToArray = (
    stateNodes: ITreeNode<NodeData>[],
    path: string[],
    contentChildren: ITreeNode<NodeData>[]
  ): ITreeNode<NodeData>[] => {
    const parent = findNode(stateNodes, path);
    if (!parent || !parent.childNodes) return stateNodes;

    const nextId = (
      Number(parent.childNodes[parent.childNodes.length - 1].id) + 1
    ).toString();

    const deleteNodeCallback = (): void =>
      setNodes(nodes => deleteNodeFromArray(nodes, [...path, nextId]));

    const nodeLabel = (
      <NodeLabel
        name={parent.id as string}
        type={parent.nodeData?.types[0]}
        addNodeCallback={null}
        deleteNodeCallback={deleteNodeCallback}
      />
    );

    const newNode: ITreeNode<NodeData> = {
      hasCaret: parent.childNodes[0].hasCaret,
      icon: parent.childNodes[0].icon,
      id: nextId,
      isExpanded: false,
      isSelected: false,
      label: nodeLabel,
      childNodes: genTreeLevel(contentChildren || [], [...path, nextId]),
      nodeData: {
        ...parent.childNodes[0].nodeData!,
        path: [...path, nextId]
      }
    };
    parent.childNodes = [...parent.childNodes, newNode];

    return Array.from(stateNodes);
  };

  const createChildNodesForArray = (
    parentPath: string[],
    name: string,
    types: string[],
    isPrimitive: boolean,
    isRequired: boolean,
    definition: string,
    contentChildren: ITreeNode<NodeData>[]
  ): ITreeNode<NodeData>[] => {
    // Check if there are already existing attributes for this node
    const pathKey = buildStringFromPath([...parentPath, name]);
    let existingChildrenIds = Object.keys(attributesForResource)
      .filter(key => key.startsWith(pathKey))
      .map(key => key.slice(pathKey.length + 1).split('.')[0]);

    const hasAttributes = existingChildrenIds.length > 0;

    let nodesForArray = [] as ITreeNode<NodeData>[];
    if (!hasAttributes) {
      // If no child exists yet, we still build one with id 0
      existingChildrenIds = ['0'];
    }
    for (const childId of existingChildrenIds) {
      const deleteNodeCallback = (): void =>
        setNodes(nodes =>
          deleteNodeFromArray(nodes, [...parentPath, name, childId])
        );

      // Create the label
      const childNodeLabel = (
        <NodeLabel
          name={name}
          type={types[0]}
          addNodeCallback={null}
          deleteNodeCallback={deleteNodeCallback}
        />
      );

      nodesForArray = [
        ...nodesForArray,
        {
          hasCaret: !isPrimitive,
          icon: (isPrimitive ? 'tag' : 'folder-open') as any,
          id: childId,
          isExpanded: false,
          isSelected: false,
          label: definition ? (
            <Tooltip boundary={'viewport'} content={definition}>
              {childNodeLabel}
            </Tooltip>
          ) : (
            childNodeLabel
          ),
          secondaryLabel: hasAttributes ? <Icon icon="dot" /> : null,
          childNodes: genTreeLevel(contentChildren || [], [
            ...parentPath,
            name,
            childId
          ]),
          nodeData: {
            types: types,
            isArray: false,
            isPrimitive: isPrimitive,
            isRequired: isRequired,
            path: [...parentPath, name, childId]
          }
        }
      ];
    }
    return nodesForArray;
  };

  const buildMultiTypeNode = (
    types: string[],
    [name, content]: [string, any],
    parentPath: string[]
  ): ITreeNode<NodeData>[] => {
    let childNodes = [] as ITreeNode<NodeData>[];
    for (const type of types) {
      const childContent = { ...content, type: [{ code: type }] };
      const child = buildNodeFromObject(
        [name + type[0].toUpperCase() + type.slice(1), childContent],
        [...parentPath, `${name}[x]`]
      );
      childNodes = [...childNodes, child];
    }
    return childNodes;
  };

  const buildNodeFromObject = (
    [name, content]: [string, any],
    parentPath: string[]
  ): ITreeNode<NodeData> => {
    // NOTE pb in parsing, remove this when solved
    content = content.x ? content.x : content;
    const isArray = content.max !== '1';
    const isRequired = content.min > 0;
    const path = [...parentPath, name];
    const types = content.type
      ? content.type.map((type: any) => type.code)
      : [];
    const isPrimitive =
      types.length > 1
        ? false
        : primitiveTypes.includes(types[0])
        ? true
        : false;
    const definition = content.definition;
    const pathString = buildStringFromPath(path);
    const hasInputs = Object.keys(attributesForResource).includes(pathString);
    const hasChildAttributes = Object.keys(attributesForResource).some(el =>
      el.startsWith(pathString)
    );
    const nodeName = types.length > 1 ? `${name}[x]` : name;

    const addNodeCallback = (): void =>
      setNodes(nodes => addNodeToArray(nodes, path, content.$children));

    const nodeLabel = (
      <NodeLabel
        name={nodeName}
        type={types.join(' | ')}
        addNodeCallback={isArray ? addNodeCallback : null}
        deleteNodeCallback={null}
      />
    );

    let childNodes = genTreeLevel(content.$children || [], path);
    if (types.length > 1) {
      childNodes = buildMultiTypeNode(types, [name, content], parentPath);
    } else if (isArray) {
      // If node is array, we need to replicate the root node for this type
      // childNode will be the node really having the structure defined by
      // the structure definition
      childNodes = createChildNodesForArray(
        parentPath,
        nodeName,
        types,
        isPrimitive,
        isRequired,
        definition,
        content.$children
      );
    }
    return {
      childNodes: childNodes,
      hasCaret: !isPrimitive || isArray,
      icon: isArray ? 'multi-select' : !isPrimitive ? 'folder-open' : 'tag',
      id: nodeName,
      isExpanded: false,
      isSelected: false,
      label: definition ? (
        <Tooltip boundary={'viewport'} content={definition}>
          {nodeLabel}
        </Tooltip>
      ) : (
        nodeLabel
      ),
      secondaryLabel: hasInputs ? (
        <Icon icon="small-tick" intent={'success'} />
      ) : isRequired ? (
        <Icon icon="dot" intent="warning" />
      ) : hasChildAttributes ? (
        <Icon icon="dot" />
      ) : null,
      nodeData: {
        types: types,
        isArray: isArray,
        isPrimitive: isPrimitive,
        isRequired: isRequired,
        path: [...parentPath, nodeName]
      }
    };
  };

  const genTreeLevel = (
    levelStructure: any,
    rootPath: string[]
  ): ITreeNode<NodeData>[] => {
    return Object.entries(levelStructure)
      .filter(entry => entry[0] !== '$meta')
      .map(entry => {
        return buildNodeFromObject(entry, rootPath);
      });
  };

  useEffect(() => {
    if (!loading) setNodes(genTreeLevel(fhirStructure, []));
  }, [resource, loading]);

  // To update secondary label on user input
  const updateSecondaryLabel = (node: ITreeNode<NodeData>) => {
    const isRequired = node.nodeData?.isRequired;
    const pathString = buildStringFromPath(node.nodeData!.path);
    const hasInputs =
      node.nodeData?.isPrimitive &&
      !node.nodeData?.isArray &&
      Object.keys(attributesForResource).includes(pathString);

    let hasChildAttributes = false;
    if (node.id.toString().endsWith('[x]')) {
      // Check if any of the children have child attributes
      hasChildAttributes = node
        .childNodes!.map(n => n.id)
        .some(childName =>
          Object.keys(attributesForResource).some(el =>
            el.startsWith(childName.toString())
          )
        );
    } else {
      hasChildAttributes = Object.keys(attributesForResource).some(el =>
        el.startsWith(pathString)
      );
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
      return nodes;
    });
  }, [attributesForResource]);

  const augmentStructure = (
    affectedNode: ITreeNode<NodeData>,
    structure: any
  ): void => {
    const treeLevel = genTreeLevel(structure, affectedNode.nodeData!.path);
    affectedNode.childNodes = treeLevel;
  };

  const handleNodeClick = async (
    node: ITreeNode<NodeData>,
    nodePath: number[]
  ): Promise<void> => {
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
          augmentStructure(node, data.structureDefinition.display);
      }
      node.isExpanded = !node.isExpanded;
    } else {
      if (selectedNode.length > 0) {
        const unselectedNode = findNodeWithNumberPath(nodes, selectedNode)!;
        unselectedNode.isSelected = false;
      }
      node.isSelected = true;
      setSelectedNode(nodePath);
      onClickCallback(buildStringFromPath(node.nodeData.path));
    }
    setNodes(Array.from(nodes));
  };

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
