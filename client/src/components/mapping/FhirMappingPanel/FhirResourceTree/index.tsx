import { Spinner } from '@blueprintjs/core';
import { useApolloClient } from '@apollo/react-hooks';
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
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import { IReduxStore } from 'types';
import { loader } from 'graphql.macro';

// GRAPHQL
const qStructureDisplay = loader(
  'src/graphql/queries/structureDisplay.graphql'
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

interface INodeData {
  types: string[];
  isArray: boolean;
  isPrimitive: boolean;
  isRequired: boolean;
  path: string[];
}

export interface IProps {
  onClickCallback: any;
}

interface INodeLabelProps {
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
}: INodeLabelProps) => {
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

const FhirResourceTree = ({ onClickCallback }: IProps) => {
  const client = useApolloClient();
  const baseDefinitionId = useSelector(
    (state: IReduxStore) => state.selectedNode.resource.definition.id
  );

  const { data, loading } = useQuery(qStructureDisplay, {
    variables: { definitionId: baseDefinitionId }
  });

  const [nodes, setNodes] = useState([{}] as ITreeNode<INodeData>[]);
  const [selectedNode, setSelectedNode] = useState([] as string[]);

  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );

  const fhirStructure =
    data && data.structureDefinition ? data.structureDefinition.display : {};
  const findNode = (nodes: ITreeNode<INodeData>[], path: string[]) => {
    let curNode = nodes.find(el => el.id === path[0]);
    for (const step of path.slice(1)) {
      curNode = curNode!.childNodes!.find(el => el.id === step);
    }
    return curNode;
  };

  const deleteNodeFromArray = (
    stateNodes: ITreeNode<INodeData>[],
    path: string[]
  ): ITreeNode<INodeData>[] => {
    // TODO also need to delete all the corresponding attributes from DB
    const newNodes = Array.from(stateNodes);

    const targetId = path.splice(-1)[0];
    const parent = findNode(newNodes, path);

    if (!parent || !parent.childNodes) return stateNodes;
    const targetIndex = parent.childNodes.findIndex(n => n.id === targetId);
    parent.childNodes.splice(targetIndex, 1);

    return newNodes;
  };

  const addNodeToArray = (
    stateNodes: ITreeNode<INodeData>[],
    path: string[]
  ): ITreeNode<INodeData>[] => {
    const newNodes = Array.from(stateNodes);

    const parent = findNode(newNodes, path);
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

    const newNode: ITreeNode<INodeData> = {
      hasCaret: parent.childNodes[0].hasCaret,
      icon: parent.childNodes[0].icon,
      id: nextId,
      isExpanded: false,
      isSelected: false,
      label: nodeLabel,
      // secondaryLabel: secondaryLabel
      nodeData: {
        ...parent.childNodes[0].nodeData!,
        path: [...path, nextId]
      }
    };
    parent.childNodes = [...parent.childNodes, newNode];

    return newNodes;
  };

  const createChildNodesForArray = (
    parentPath: string[],
    name: string,
    types: string[],
    deleteNodeCallback: Function,
    isPrimitive: boolean,
    isRequired: boolean,
    definition: string
  ): ITreeNode<INodeData>[] => {
    // Create the label
    const childNodeLabel = (
      <NodeLabel
        name={name}
        type={types[0]}
        addNodeCallback={null}
        deleteNodeCallback={deleteNodeCallback}
      />
    );

    // Check if there are already existing attributes for this node
    const pathKey = [...parentPath, name].join('.');
    let existingChildrenIds = Object.keys(attributesForResource)
      .filter(key => key.startsWith(pathKey))
      .map(key => key.slice(pathKey.length + 1).split('.')[0]);

    const hasAttributes = existingChildrenIds.length > 0;

    let childNodes = [] as ITreeNode<INodeData>[];
    if (!hasAttributes) {
      // If no child exists yet, we still build one with id 0
      existingChildrenIds = ['0'];
    }
    for (const childId of existingChildrenIds) {
      childNodes = [
        ...childNodes,
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
    return childNodes;
  };

  const buildNodeFromObject = (
    [name, content]: [string, any],
    parentPath: string[]
  ): ITreeNode<INodeData> => {
    const isPrimitive = content.type
      ? primitiveTypes.includes(content.type[0].code)
      : true; // TODO what if type is absent?
    const isArray = content.max !== '1';
    const isRequired = content.min > 0;
    const path = parentPath.concat(name);
    const types = content.type
      ? content.type.map((type: any) => type.code)
      : [];
    const definition = content.definition;

    const addNodeCallback = (): void =>
      setNodes(nodes => addNodeToArray(nodes, path));

    const deleteNodeCallback = (): void =>
      setNodes(nodes => deleteNodeFromArray(nodes, [...path, '0']));

    const nodeLabel = (
      <NodeLabel
        name={name}
        type={types[0]}
        addNodeCallback={isArray ? addNodeCallback : null}
        deleteNodeCallback={null}
      />
    );

    // If node is array, we need to replicate the root node for this type
    // childNode will be the node really having the structure defined by
    // the structure definition
    let childNodes = [] as ITreeNode<INodeData>[];
    if (isArray) {
      childNodes = createChildNodesForArray(
        parentPath,
        name,
        types,
        deleteNodeCallback,
        isPrimitive,
        isRequired,
        definition
      );
    }
    return {
      childNodes: childNodes,
      hasCaret: !isPrimitive || isArray,
      icon: isArray ? 'multi-select' : !isPrimitive ? 'folder-open' : 'tag',
      id: name,
      isExpanded: false,
      isSelected: false,
      label: definition ? (
        <Tooltip boundary={'viewport'} content={definition}>
          {nodeLabel}
        </Tooltip>
      ) : (
        nodeLabel
      ),
      // secondaryLabel: secondaryLabel
      nodeData: {
        types: types,
        isArray: isArray,
        isPrimitive: isPrimitive,
        isRequired: isRequired,
        path: [...parentPath, name]
      }
    };
  };

  const genTreeLevel = (
    levelStructure: any,
    rootPath: string[]
  ): ITreeNode<INodeData>[] => {
    return Object.entries(levelStructure)
      .filter(entry => entry[0] !== '$meta')
      .map(entry => {
        return buildNodeFromObject(entry, rootPath);
      });
  };

  useEffect(() => {
    if (!loading) setNodes(genTreeLevel(fhirStructure, []));
  }, [loading, fhirStructure]);

  const augmentStructure = (
    affectedNode: ITreeNode<INodeData>,
    structure: any
  ): void => {
    const treeLevel = genTreeLevel(structure, affectedNode.nodeData!.path);
    affectedNode.childNodes = treeLevel;
  };

  const handleNodeClick = async (
    node: ITreeNode<INodeData>,
    _nodePath: number[],
    _e: React.MouseEvent<HTMLElement>
  ) => {
    const newNodes = Array.from(nodes);

    const affectedNode = findNode(newNodes, node.nodeData!.path)!;

    if (node.nodeData?.isArray) {
      affectedNode.isExpanded = !affectedNode.isExpanded;
    } else if (!node.nodeData?.isPrimitive) {
      if (!node.childNodes || node.childNodes.length === 0) {
        // TODO what if several types are possible?
        const { data } = await client.query({
          query: qStructureDisplay,
          variables: { definitionId: node.nodeData?.types[0] }
        });
        augmentStructure(affectedNode, data.structureDefinition.display);
      }
      affectedNode.isExpanded = !affectedNode.isExpanded;
    } else {
      if (selectedNode.length > 0) {
        const unselectedNode = findNode(newNodes, selectedNode)!;
        unselectedNode.isSelected = false;
      }
      affectedNode.isSelected = true;
      setSelectedNode(affectedNode.nodeData!.path);
      onClickCallback(affectedNode.nodeData);
    }
    setNodes(newNodes);
  };

  return loading ? (
    <Spinner />
  ) : (
    <Tree
      className={Classes.ELEVATION_0}
      contents={nodes}
      onNodeClick={handleNodeClick}
      onNodeCollapse={(node: ITreeNode): void => {
        node.isExpanded = false;
      }}
      onNodeExpand={(node: ITreeNode): void => {
        node.isExpanded = true;
      }}
    />
  );
};

export default FhirResourceTree;
