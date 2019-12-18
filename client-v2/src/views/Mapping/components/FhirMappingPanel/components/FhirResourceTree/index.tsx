import {
  Classes,
  ContextMenu,
  Icon,
  ITreeNode,
  Menu,
  MenuItem,
  Tooltip,
  Tree
} from "@blueprintjs/core";
import React from "react";
import { ApolloClient } from "apollo-client";
import { withApollo } from "react-apollo";
import { useSelector } from "react-redux";

import { IReduxStore } from "src/types";

// GRAPHQL
const qResourceAttributeTree = require("src/graphql/queries/resourceAttributeTree.graphql");
const mCreateAttribute = require("src/graphql/mutations/createAttribute.graphql");
const mDeleteAttribute = require("src/graphql/mutations/deleteAttribute.graphql");
const qAttributeChildren = require("src/graphql/queries/attributeChildren.graphql");

interface INodeData {
  description: string;
  fhirType: string;
  id: string;
  isArray: boolean;
  name: string;
  parent: INodeData;
  children: INodeData[];
  path: string[];
}

export interface IProps {
  client?: ApolloClient<any>;
  expandedAttributesIdList: string[];
  nodeCollapseCallback: any;
  nodeExpandCallback: any;
  json: any;
  onClickCallback: any;
  selectedNodeId: string;
}

export interface IState {
  isBroken: boolean;
  nodes: ITreeNode<INodeData>[];
  renderJson: string;
  selectedNode: ITreeNode<INodeData>;
}

interface INodeLabelProps {
  client: any;
  node: any;
  nodePath: String[];
}

interface INodeLabelState {
  isContextMenuOpen: boolean;
}

const NodeLabel = ({ client, node, nodePath }: INodeLabelProps) => {

  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);

  const [isContextMenuOpen, setIsContextMenuOpen] = React.useState(false);

  // Methods to update Apollo cache after creation/deletion mutations
  const buildNewResource = (
    resource: any, path: String[], adding: boolean, data: any
  ): INodeData => {
    if (path.length > 0) {
      return resource.children ? {
        ...resource,
        children: (
          resource.children.map(
            (c: any) => c.id === path[0]
              ? buildNewResource(c, path.splice(1), adding, data)
              : c
          )
        )
      } : {
          ...resource,
          attributes: (
            resource.attributes.map(
              (c: any) => c.id === path[0]
                ? buildNewResource(c, path.splice(1), adding, data)
                : c
            )
          )
        }
    }
    return {
      ...resource,
      children:
        adding  // If not adding then we are removing
          ? resource.children.concat([data])
          : resource.children.filter((c: any) => c.id !== data.id),
    }
  }

  const readCacheQuery = (cache: any) => {
    return cache.readQuery({
      query: qResourceAttributeTree,
      variables: {
        resourceId: selectedNode.resource.id,
      }
    });
  }

  const writeInCache = (cache: any, data: any) => {
    cache.writeQuery({
      query: qResourceAttributeTree,
      variables: {
        resourceId: selectedNode.resource.id,
      },
      data: data,
    })
  }

  const addAttributeToCache = (
    cache: any,
    { data: { createAttribute } }: any
  ) => {
    try {
      const { resource } = readCacheQuery(cache)

      const newResource =
        buildNewResource(resource, nodePath.concat([node.id]), true, createAttribute)
      
      writeInCache(cache, {resource: newResource})
    } catch (error) {
      console.log(error)
    }
  }

  const removeAttributeFromCache = (
    cache: any,
    { data: { deleteAttribute } }: any
  ) => {
    try {
      const { resource } = readCacheQuery(cache)

      const newResource =
        buildNewResource(resource, nodePath, false, deleteAttribute)
      
      writeInCache(cache, {resource: newResource})
    } catch (error) {
      console.log(error)
    }
  }

  const showContextMenu = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const menu = node.isArray ? (
      <Menu>
        <MenuItem
          icon={"add"}
          onClick={() => {
            client.mutate({
              mutation: mCreateAttribute,
              variables: {
                parentId: node.id,
              },
              update: addAttributeToCache,
            })
          }}
          text={"Ajouter un item"}
        />
      </Menu>
    ) : node.parent && node.parent.isArray ? (
      <Menu>
        <MenuItem
          icon={"delete"}
          onClick={() => {
            client
              .mutate({
                mutation: mDeleteAttribute,
                variables: {
                  attributeId: node.id
                },
                update: removeAttributeFromCache,
              })
          }}
          text={"Supprimer l'item"}
        />
      </Menu>
    ) : null;

    ContextMenu.show(menu, { left: e.clientX, top: e.clientY }, () =>
      setIsContextMenuOpen(false)
    );

    setIsContextMenuOpen(true)
  };

  return (
    <div className={"node-label"} onContextMenu={showContextMenu}>
      <div>{node.name}</div>
      <div className={"node-type"}>{node.fhirType}</div>
    </div>
  );
}

class FhirResourceTree extends React.Component<IProps, IState> {
  static id: number = 0;

  constructor(props: IProps) {
    super(props);
    this.state = {
      isBroken: false,
      nodes: [],
      renderJson: "",
      selectedNode: null
    };
  }

  static getId = (): number => {
    FhirResourceTree.id++;
    return FhirResourceTree.id;
  };

  private static breadthFirstSearchInputs = (node: any) => {
    if (node.inputs && node.inputs.length > 0) {
      return true;
    } else if (node.attributes && node.attributes.length > 0) {
      return node.attributes.some((attribute: any) => {
        return FhirResourceTree.breadthFirstSearchInputs(attribute);
      });
    } else {
      return false;
    }
  };

  private static forEachNode(
    nodes: ITreeNode[],
    callback: (node: ITreeNode) => void
  ) {
    if (nodes == null) {
      return;
    }

    for (const node of nodes) {
      callback(node);
      FhirResourceTree.forEachNode(node.childNodes, callback);
    }
  }

  static getDerivedStateFromProps(props: IProps, state: IState) {
    const genObjNodes = (
      node: any,
      pathAcc: string[]
    ): ITreeNode<INodeData> => {
      const nodeLabel = (
        <NodeLabel
          node={node}
          nodePath={pathAcc}
          client={props.client}
        />
      );

      const hasChildren = node.children && node.children.length > 0;
      const hasInputs = node.inputs && node.inputs.length > 0;
      const nodePath = [...pathAcc, node.id];

      const secondaryLabel = hasInputs ? (
        <Icon icon="small-tick" intent={"success"} />
      ) : hasChildren ? (
        FhirResourceTree.breadthFirstSearchInputs(node) ? (
          <Icon icon="dot" />
        ) : null
      ) : null;
      return {
        childNodes: hasChildren
          ? node.children.map((child: any) => {
            return genObjNodes(child, nodePath);
          })
          : null,
        hasCaret: hasChildren,
        icon: node.isArray
          ? "multi-select"
          : hasChildren
            ? "folder-open"
            : "tag",
        id: FhirResourceTree.getId(),
        isExpanded: false,
        isSelected: false,
        label: node.description ? (
          <Tooltip boundary={"viewport"} content={node.description}>
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
          name: node.name,
          parent: node.parent,
          children: node.children,
          path: nodePath,
        },
        secondaryLabel: secondaryLabel
      };
    };

    if (props.json !== state.renderJson) {
      try {
        let nodes = props.json.map((attribute: any) => {
          return genObjNodes(attribute, []);
        });

        const selectedNode = nodes.filter((node: ITreeNode<INodeData>) => {
          return node.nodeData.id == props.selectedNodeId;
        })[0];

        FhirResourceTree.forEachNode(nodes, (node: ITreeNode<INodeData>) => {
          node.isSelected = node.nodeData.id == props.selectedNodeId;
          node.isExpanded = selectedNode
            ? selectedNode.nodeData.path.indexOf(node.nodeData.id) != -1
            : props.expandedAttributesIdList.indexOf(node.nodeData.id) >= 0;
        });

        return {
          isBroken: false,
          nodes: nodes,
          renderJson: props.json,
          selectedNode
        };
      } catch (err) {
        console.log(err);
        return {
          isBroken: true,
          nodes: [],
          renderJson: props.json,
          selectedNode: null
        };
      }
    } else {
      return state;
    }
  }

  private handleNodeCollapse = (node: ITreeNode<INodeData>) => {
    node.isExpanded = false;
    this.setState(this.state);
    this.props.nodeCollapseCallback(node);
  };

  private handleNodeExpand = (node: ITreeNode<INodeData>) => {
    node.isExpanded = true;
    this.setState(this.state);
    this.props.nodeExpandCallback(node);
  };

  private handleNodeClick = (
    node: ITreeNode<INodeData>,
    _nodePath: number[],
    e: React.MouseEvent<HTMLElement>
  ) => {
    // Can only select tree leaves
    if (!node.hasCaret) {
      const originallySelected = node.isSelected;

      if (!e.shiftKey) {
        FhirResourceTree.forEachNode(
          this.state.nodes,
          (node: ITreeNode<INodeData>) => (node.isSelected = false)
        );
      }

      node.isSelected = originallySelected == null ? true : !originallySelected;
      this.setState(this.state);

      this.props.onClickCallback(node.nodeData);
    } else {
      if (node.isExpanded) {
        this.handleNodeCollapse(node);
      } else {
        this.handleNodeExpand(node);
      }
    }
  };

  public render() {
    return (
      <Tree
        className={Classes.ELEVATION_0}
        contents={this.state.nodes}
        onNodeClick={this.handleNodeClick}
        onNodeCollapse={this.handleNodeCollapse}
        onNodeExpand={this.handleNodeExpand}
      />
    );
  }
}

export default withApollo(FhirResourceTree as any) as any;
