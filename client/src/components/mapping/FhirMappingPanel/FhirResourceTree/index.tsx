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
import React, { useState, useEffect } from 'react';
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
  childTypes: string[];
  id: string;
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
  isArray: boolean;
  addNodeCallback: any;
  deleteNodeCallback: any;
}

const NodeLabel = ({ name, type, isArray, path }: INodeLabelProps) => {
  const showContextMenu = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    let menu;
    if (isArray) {
      menu = (
        <Menu>
          <MenuItem
            icon={'add'}
            onClick={() => {
              // TODO
            }}
            text={'Ajouter un item'}
          />
        </Menu>
      );
    } else if (
      name === 'false' //false
      // node.parent &&
      // node.parent.isArray
      // hasMoreThanOneSibling(nodePath)
    ) {
      menu = (
        <Menu>
          <MenuItem
            icon={'delete'}
            onClick={() => {
              // TODO
            }}
            text={"Supprimer l'item"}
          />
        </Menu>
      );
    }

    if (menu) {
      ContextMenu.show(menu, { left: e.clientX, top: e.clientY });
    }
  };

  return (
    <div className={'node-label'} onContextMenu={showContextMenu}>
      <div>{name}</div>
      <div className={'node-type'}>{type ? type[0].code : ''}</div>
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

  const [nodes, setNodes] = useState([] as ITreeNode<INodeData>[]);
  const [selectedNode, setSelectedNode] = useState([] as string[]);

  const fhirStructure =
    data && data.structureDefinition ? data.structureDefinition.display : {};

  //   const forEachNode = (
  //     nodes: ITreeNode<INodeData>[],
  //     callback: (node: ITreeNode<INodeData>) => void
  //   ) => {
  //     if (nodes == null) {
  //       return;
  //     }

  //     for (const node of nodes) {
  //       callback(node);
  //       if (node.childNodes) {
  //         forEachNode(node.childNodes, callback);
  //       }
  //     }
  //   };

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

    const nodeLabel = NodeLabel({ name, type: content.type, isArray, path });

    if (isArray) {
      // If node is array, we need to replicate the root node for this type
      // childNode will be the node really having the structure defined by
      // the structure definition
      const childNode = {
        hasCaret: !isPrimitive,
        icon: (!isPrimitive ? 'folder-open' : 'tag') as any,
        id: '0', // TODO change id to path?
        isExpanded: false,
        isSelected: false,
        label: content.definition ? (
          <Tooltip boundary={'viewport'} content={content.definition}>
            {nodeLabel}
          </Tooltip>
        ) : (
          nodeLabel
        ),
        // secondaryLabel: secondaryLabel
        nodeData: {
          childTypes: content.type
            ? content.type.map((type: any) => type.code)
            : [],
          id: content.id,
          isArray: false,
          isPrimitive: false,
          isRequired: isRequired,
          path: [...parentPath, name, '0']
        }
      };
      return {
        childNodes: [childNode],
        hasCaret: true,
        icon: 'multi-select',
        id: name, // TODO change id to path?
        isExpanded: false,
        isSelected: false,
        label: content.definition ? (
          <Tooltip boundary={'viewport'} content={content.definition}>
            {nodeLabel}
          </Tooltip>
        ) : (
          nodeLabel
        ),
        // secondaryLabel: secondaryLabel
        nodeData: {
          childTypes: [],
          id: content.id,
          isArray: true,
          isPrimitive: isPrimitive,
          isRequired: isRequired,
          path: [...parentPath, name]
        }
      };
    } else {
      return {
        hasCaret: !isPrimitive,
        icon: isArray ? 'multi-select' : !isPrimitive ? 'folder-open' : 'tag',
        id: name, // TODO change id to path?
        isExpanded: false,
        isSelected: false,
        label: content.definition ? (
          <Tooltip boundary={'viewport'} content={content.definition}>
            {nodeLabel}
          </Tooltip>
        ) : (
          nodeLabel
        ),
        // secondaryLabel: secondaryLabel
        nodeData: {
          childTypes: content.type
            ? content.type.map((type: any) => type.code)
            : [],
          id: content.id,
          isArray: isArray,
          isPrimitive: isPrimitive,
          isRequired: isRequired,
          path: [...parentPath, name]
        }
      };
    }
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
    setNodes(genTreeLevel(fhirStructure, []));
  }, [loading]);

  const findNode = (nodes: ITreeNode<INodeData>[], path: string[]) => {
    let curNode = nodes.find(el => el.id === path[0]);
    console.log(path);
    for (const step of path.slice(1)) {
      curNode = curNode!.childNodes!.find(el => el.id === step);
    }
    return curNode;
  };

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
          variables: { definitionId: node.nodeData?.childTypes[0] }
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
