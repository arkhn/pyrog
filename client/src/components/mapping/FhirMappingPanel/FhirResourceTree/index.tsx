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
  description: string;
  fhirType: string;
  childTypes: string[];
  id: string;
  isArray: boolean;
  isPrimitive: boolean;
  isRequired: boolean;
  name: string;
  parent: INodeData;
  path: string[];
}

export interface IProps {
  baseDefinitionId: string;
  expandedAttributesIdList: string[];
  // nodeCollapseCallback: any;
  // nodeExpandCallback: any;
  onClickCallback: any;
  selectedAttributeId?: string;
}

const FhirResourceTree = ({
  baseDefinitionId,
  selectedAttributeId,
  expandedAttributesIdList,
  // nodeCollapseCallback,
  // nodeExpandCallback,
  onClickCallback
}: IProps) => {
  const client = useApolloClient();

  // const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);

  const { data, loading } = useQuery(qStructureDisplay, {
    variables: { definitionId: baseDefinitionId }
  });

  const [nodes, setNodes] = useState([] as ITreeNode<INodeData>[]);

  const fhirStructure =
    data && data.structureDefinition ? data.structureDefinition.display : {};

  // const { data: dataTree, loading: loaingTree } = useQuery(
  //   qResourceAttributeTree,
  //   {
  //     variables: {
  //       resourceId: selectedNode.resource.id
  //     },
  //     skip: !selectedNode.resource.id
  //   }
  // );

  // if (loadingTree) {
  //   return <Spinner />;
  // }

  // const attributesTree = dataTree ? dataTree.resource.attributes : null;

  // Sort tree
  // const sortByName = (a: INodeData, b: INodeData) => (a.name > b.name ? 1 : -1);
  // attributesTree.sort(sortByName);

  // const bfsInputs = (node: any) => {
  //   if (node.inputs && node.inputs.length > 0) {
  //     return true;
  //   } else if (node.children && node.children.length > 0) {
  //     return node.children.some((attribute: any) => {
  //       return bfsInputs(attribute);
  //     });
  //   } else {
  //     return false;
  //   }
  // };

  const forEachNode = (
    nodes: ITreeNode<INodeData>[],
    callback: (node: ITreeNode<INodeData>) => void
  ) => {
    if (nodes == null) {
      return;
    }

    for (const node of nodes) {
      callback(node);
      if (node.childNodes) {
        forEachNode(node.childNodes, callback);
      }
    }
  };

  // const genObjNodes_old = (node: any, pathAcc: string[]): ITreeNode<INodeData> => {
  //   const nodeLabel = <NodeLabel node={node} nodePath={pathAcc} />;

  //   const hasChildren = node.children && node.children.length > 0;
  //   const hasInputs = node.inputs && node.inputs.length > 0;
  //   const nodePath = [...pathAcc, node.id];

  //   const secondaryLabel = hasInputs ? (
  //     <Icon icon="small-tick" intent={'success'} />
  //   ) : node.isRequired ? (
  //     <Icon icon="dot" intent="warning" />
  //   ) : bfsInputs(node) ? (
  //     <Icon icon="dot" />
  //   ) : null;

  //   return {
  //     childNodes: node.isArray // We don't want to sort if isArray because all children have same name
  //       ? node.children.map((child: any) => {
  //         return genObjNodes_old(child, nodePath);
  //       })
  //       : hasChildren
  //         ? node.children.sort(sortByName).map((child: any) => {
  //           return genObjNodes_old(child, nodePath);
  //         })
  //         : null,
  //     hasCaret: hasChildren,
  //     icon: node.isArray ? 'multi-select' : hasChildren ? 'folder-open' : 'tag',
  //     id: node.id,
  //     isExpanded: false,
  //     isSelected: false,
  //     label: node.description ? (
  //       <Tooltip boundary={'viewport'} content={node.description}>
  //         {nodeLabel}
  //       </Tooltip>
  //     ) : (
  //         nodeLabel
  //       ),
  //     nodeData: {
  //       description: node.description,
  //       fhirType: node.fhirType,
  //       id: node.id,
  //       isArray: node.isArray,
  //       isRequired: node.isRequired,
  //       name: node.name,
  //       parent: node.parent
  //     },
  //     secondaryLabel: secondaryLabel
  //   };
  // };

  const buildNodeFromObject = (
    [name, content]: [string, any],
    parentPath: string[]
  ): ITreeNode<INodeData> => {
    const nodeLabel = (
      <div className={'node-label'}>
        <div>{name}</div>
        <div className={'node-type'}>
          {content.type ? content.type[0].code : ''}
        </div>
      </div>
    );

    const isPrimitive = content.type
      ? primitiveTypes.includes(content.type[0].code)
      : true; // TODO what if type is absent?
    const isArray = content.max !== '1';
    const isRequired = content.min > 0;
    const path = parentPath.concat(name);
    console.log('new', path);

    return {
      hasCaret: !isPrimitive,
      icon: isArray ? 'multi-select' : !isPrimitive ? 'folder-open' : 'tag',
      id: name, // TODO change id to path?
      isExpanded: false,
      isSelected: false,
      label: content.description ? (
        <Tooltip boundary={'viewport'} content={content.description}>
          {nodeLabel}
        </Tooltip>
      ) : (
        nodeLabel
      ),
      // secondaryLabel: secondaryLabel
      nodeData: {
        description: content.description,
        fhirType: content.fhirType,
        childTypes: content.type
          ? content.type.map((type: any) => type.code)
          : [],
        id: content.id,
        isArray: isArray,
        isPrimitive: isPrimitive,
        isRequired: isRequired,
        name: content.name,
        parent: content.parent,
        path: path
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
    setNodes(genTreeLevel(fhirStructure, []));
  }, [loading]);

  // forEachNode(nodes, (node: ITreeNode<INodeData>) => {
  //   if (!node.nodeData) {
  //     node.isSelected = false;
  //     node.isExpanded = false;
  //     return;
  //   }
  //   node.isSelected = false;
  //   node.isExpanded = expandedAttributesIdList.indexOf(node.nodeData.id) >= 0;
  // });

  const findNode = (nodes: ITreeNode<INodeData>[], path: string[]) => {
    let curNode = nodes.find(el => el.id === path[0]);
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

    if (!node.nodeData?.isPrimitive) {
      if (!node.childNodes || node.childNodes.length == 0) {
        console.log('WILL QUERY');
        const { data } = await client.query({
          query: qStructureDisplay,
          variables: { definitionId: node.nodeData?.childTypes[0] }
        });
        augmentStructure(affectedNode, data.structureDefinition.display);
      }
      affectedNode.isExpanded = !affectedNode.isExpanded;
    } else {
      affectedNode.isSelected = true;
      // onClickCallback(node.nodeData);
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
