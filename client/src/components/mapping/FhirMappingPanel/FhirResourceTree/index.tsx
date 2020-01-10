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
import React from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';

import { IReduxStore } from 'types';
import { loader } from 'graphql.macro';

// GRAPHQL
const qResourceAttributeTree = loader(
  'src/graphql/queries/resourceAttributeTree.graphql'
);
const mCreateAttribute = loader(
  'src/graphql/mutations/createAttribute.graphql'
);
const mDeleteAttribute = loader(
  'src/graphql/mutations/deleteAttribute.graphql'
);

interface INodeData {
  description: string;
  fhirType: string;
  id: string;
  isArray: boolean;
  isRequired: boolean;
  name: string;
  parent: INodeData;
}

export interface IProps {
  expandedAttributesIdList: string[];
  nodeCollapseCallback: any;
  nodeExpandCallback: any;
  onClickCallback: any;
  selectedAttributeId?: string;
}

interface INodeLabelProps {
  node: INodeData;
  nodePath: string[];
}

const NodeLabel = ({ node, nodePath }: INodeLabelProps) => {
  const client = useApolloClient();

  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);

  // Methods to update Apollo cache after creation/deletion mutations
  const buildNewResource = (
    resource: any,
    path: string[],
    adding: boolean,
    data: any
  ): INodeData => {
    if (path.length > 0) {
      return resource.children
        ? {
            ...resource,
            children: resource.children.map((c: any) =>
              c.id === path[0]
                ? buildNewResource(c, path.splice(1), adding, data)
                : c
            )
          }
        : {
            ...resource,
            attributes: resource.attributes.map((c: any) =>
              c.id === path[0]
                ? buildNewResource(c, path.splice(1), adding, data)
                : c
            )
          };
    }
    return {
      ...resource,
      children: adding // If not adding then we are removing
        ? resource.children.concat([data])
        : resource.children.filter((c: any) => c.id !== data.id)
    };
  };

  const readCacheQuery = (cache: any) => {
    return cache.readQuery({
      query: qResourceAttributeTree,
      variables: {
        resourceId: selectedNode.resource.id
      }
    });
  };

  const writeInCache = (cache: any, data: any) => {
    cache.writeQuery({
      query: qResourceAttributeTree,
      variables: {
        resourceId: selectedNode.resource.id
      },
      data: data
    });
  };

  const addAttributeToCache = (
    cache: any,
    { data: { createAttribute } }: any
  ) => {
    try {
      const { resource } = readCacheQuery(cache);

      const newResource = buildNewResource(
        resource,
        nodePath.concat([node.id]),
        true,
        createAttribute
      );

      writeInCache(cache, { resource: newResource });
    } catch (error) {
      console.log(error);
    }
  };

  const removeAttributeFromCache = (
    cache: any,
    { data: { deleteAttribute } }: any
  ) => {
    try {
      const { resource } = readCacheQuery(cache);

      const newResource = buildNewResource(
        resource,
        nodePath,
        false,
        deleteAttribute
      );

      writeInCache(cache, { resource: newResource });
    } catch (error) {
      console.log(error);
    }
  };

  const hasMoreThanOneSibling = (path: string[]) => {
    const data = client.readQuery({
      query: qResourceAttributeTree,
      variables: {
        resourceId: selectedNode.resource.id
      }
    });
    if (!data) return false;

    let resource = data.resource.attributes.find((a: any) => a.id === path[0]);
    path = path.slice(1);
    for (const id of path) {
      resource = resource.children.find((c: any) => c.id === id);
    }
    return resource.children.length > 1;
  };

  const showContextMenu = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    let menu;
    if (node.isArray) {
      menu = (
        <Menu>
          <MenuItem
            icon={'add'}
            onClick={() => {
              client.mutate({
                mutation: mCreateAttribute,
                variables: {
                  parentId: node.id
                },
                update: addAttributeToCache
              });
            }}
            text={'Ajouter un item'}
          />
        </Menu>
      );
    } else if (
      node.parent &&
      node.parent.isArray &&
      hasMoreThanOneSibling(nodePath)
    ) {
      menu = (
        <Menu>
          <MenuItem
            icon={'delete'}
            onClick={() => {
              client.mutate({
                mutation: mDeleteAttribute,
                variables: {
                  attributeId: node.id
                },
                update: removeAttributeFromCache
              });
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
      <div>{node.name}</div>
      <div className={'node-type'}>{node.fhirType}</div>
    </div>
  );
};

const FhirResourceTree = ({
  selectedAttributeId,
  expandedAttributesIdList,
  nodeCollapseCallback,
  nodeExpandCallback,
  onClickCallback
}: IProps) => {
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);

  const { data: dataTree, loading: loadingTree } = useQuery(
    qResourceAttributeTree,
    {
      variables: {
        resourceId: selectedNode.resource.id
      },
      skip: !selectedNode.resource.id
    }
  );

  if (loadingTree) {
    return <Spinner />;
  }

  const attributesTree = dataTree ? dataTree.resource.attributes : null;

  // Sort tree
  const sortByName = (a: INodeData, b: INodeData) => (a.name > b.name ? 1 : -1);
  attributesTree.sort(sortByName);

  const bfsInputs = (node: any) => {
    if (node.inputs && node.inputs.length > 0) {
      return true;
    } else if (node.children && node.children.length > 0) {
      return node.children.some((attribute: any) => {
        return bfsInputs(attribute);
      });
    } else {
      return false;
    }
  };

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

  const genObjNodes = (node: any, pathAcc: string[]): ITreeNode<INodeData> => {
    const nodeLabel = <NodeLabel node={node} nodePath={pathAcc} />;

    const hasChildren = node.children && node.children.length > 0;
    const hasInputs = node.inputs && node.inputs.length > 0;
    const nodePath = [...pathAcc, node.id];

    const secondaryLabel = hasInputs ? (
      <Icon icon="small-tick" intent={'success'} />
    ) : node.isRequired ? (
      <Icon icon="dot" intent="warning" />
    ) : bfsInputs(node) ? (
      <Icon icon="dot" />
    ) : null;

    return {
      childNodes: node.isArray // We don't want to sort if isArray because all children have same name
        ? node.children.map((child: any) => {
            return genObjNodes(child, nodePath);
          })
        : hasChildren
        ? node.children.sort(sortByName).map((child: any) => {
            return genObjNodes(child, nodePath);
          })
        : null,
      hasCaret: hasChildren,
      icon: node.isArray ? 'multi-select' : hasChildren ? 'folder-open' : 'tag',
      id: node.id,
      isExpanded: false,
      isSelected: false,
      label: node.description ? (
        <Tooltip boundary={'viewport'} content={node.description}>
          {nodeLabel}
        </Tooltip>
      ) : (
        nodeLabel
      ),
      nodeData: {
        description: node.description,
        fhirType: node.fhirType,
        id: node.id,
        isArray: node.isArray,
        isRequired: node.isRequired,
        name: node.name,
        parent: node.parent
      },
      secondaryLabel: secondaryLabel
    };
  };

  const nodes = attributesTree.map((attribute: any) => {
    return genObjNodes(attribute, []);
  });

  forEachNode(nodes, (node: ITreeNode<INodeData>) => {
    if (!node.nodeData) {
      node.isSelected = false;
      node.isExpanded = false;
    }
    node.isSelected = node.nodeData!.id === selectedAttributeId;
    node.isExpanded = expandedAttributesIdList.indexOf(node.nodeData!.id) >= 0;
  });

  const handleNodeClick = (
    node: ITreeNode<INodeData>,
    _nodePath: number[],
    e: React.MouseEvent<HTMLElement>
  ) => {
    // Can only select tree leaves
    if (!node.hasCaret) {
      const originallySelected = node.isSelected;

      if (!e.shiftKey) {
        forEachNode(
          nodes,
          (node: ITreeNode<INodeData>) => (node.isSelected = false)
        );
      }

      node.isSelected = originallySelected == null ? true : !originallySelected;

      onClickCallback(node.nodeData);
    } else {
      if (node.isExpanded) {
        node.isExpanded = false;
        nodeCollapseCallback(node);
      } else {
        node.isExpanded = true;
        nodeExpandCallback(node);
      }
    }
  };

  return (
    <Tree
      className={Classes.ELEVATION_0}
      contents={nodes}
      onNodeClick={handleNodeClick}
    />
  );
};

export default FhirResourceTree;
