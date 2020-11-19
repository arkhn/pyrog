import { IconName } from '@blueprintjs/core';
import { ITreeNode } from '@blueprintjs/core';
import React from 'react';

import { Attribute, ResourceDefinition } from '@arkhn/fhir.ts';

// ACTIONS

import { NodeLabel } from './nodeLabel';
import { IStructureDefinition } from 'types';
import { SecondaryLabel } from './secondaryLabel';

export class TreeNode implements ITreeNode<Attribute> {
  // ITreeNode interface
  childNodes?: ITreeNode<Attribute>[];
  hasCaret?: boolean;
  icon?: IconName;
  id: string | number;
  secondaryLabel?: React.ReactElement;
  nodeData: Attribute;
  label: string | React.ReactElement;
  isSelected?: boolean;
  isExpanded?: boolean;

  // custom attributes
  onAddExtension: Function;
  onAddItem: Function;
  onAddSlice: Function;
  onDeleteItem: Function;
  genTreeLevel: Function;

  constructor(
    attribute: Attribute,
    childNodes: ITreeNode<Attribute>[],
    resourceExtensions: ResourceDefinition[],
    onAddExtension: Function,
    onAddItem: Function,
    onAddSlice: Function,
    onDeleteItem: Function,
    genTreeLevel: Function,
    parentArray?: ITreeNode<Attribute>
  ) {
    this.id = attribute.tail;
    this.nodeData = attribute;
    this.childNodes = childNodes;
    this.hasCaret =
      !attribute.isPrimitive ||
      attribute.choices.length > 0 ||
      attribute.isArray;
    this.icon = attribute.isArray
      ? 'multi-select'
      : !attribute.isPrimitive || attribute.choices.length > 0
      ? 'folder-open'
      : 'tag';
    this.secondaryLabel = <SecondaryLabel attribute={attribute} />;
    this.label = (
      <NodeLabel
        attribute={attribute}
        resourceExtensions={resourceExtensions}
        addExtensionCallback={(e: any) => onAddExtension(this, e)}
        addNodeCallback={() => onAddItem(this)}
        addSliceCallback={(sliceName: string) => onAddSlice(this, sliceName)}
        deleteNodeCallback={() => onDeleteItem(this, parentArray!)}
      />
    );
    this.onAddItem = onAddItem;
    this.onAddSlice = onAddSlice;
    this.onAddExtension = onAddExtension;
    this.onDeleteItem = onDeleteItem;
    this.genTreeLevel = genTreeLevel;
  }

  create(attr: Attribute, childNodes: TreeNode[], array?: TreeNode) {
    return new TreeNode(
      attr,
      childNodes,
      [],
      this.onAddExtension,
      this.onAddItem,
      this.onAddSlice,
      this.onDeleteItem,
      this.genTreeLevel,
      array
    );
  }

  updateSecondaryLabel() {
    if (!this.nodeData) return;
    this.secondaryLabel = <SecondaryLabel attribute={this.nodeData} />;
    this.childNodes?.forEach(child =>
      (child as TreeNode).updateSecondaryLabel()
    );
  }

  addItem(index?: number, attr?: Attribute) {
    const item = this.nodeData.addItem(index, attr);
    const nodeItem = this.create(
      item,
      this.genTreeLevel([...item.children, ...item.choices]),
      this
    );
    this.childNodes?.push(nodeItem);
    return nodeItem;
  }

  addSlice(sliceName?: string, index?: number) {
    const slice = this.nodeData.slices.find(
      s => s.definition.sliceName === sliceName
    )!;
    return this.addItem(index, slice);
  }

  addExtension(
    extensionDefinition: IStructureDefinition,
    index?: number
  ): TreeNode | undefined {
    if (!this.nodeData.isArray || !this.nodeData.isExtension)
      throw new Error(
        `Attribute ${this.nodeData.id} is not an extensions array`
      );
    if (this.nodeData.parent?.isPrimitive) {
      // if the attribute is of primitive type,
      // the extension must be placed on the parent
      return;
    }

    let extension: Attribute;
    if (!this.nodeData.parent) {
      extension = this.nodeData.addItem(
        index,
        new Attribute({
          ...this.nodeData.definition,
          type: [{ code: extensionDefinition.id }]
        })
      );
    } else {
      // if the attribute has an extension child,
      // append the extension attribute to the array node
      extension = this.nodeData.parent!.addExtension(
        extensionDefinition.id,
        index
      );
    }
    extensionDefinition.attributes
      .map(a => Attribute.from(a.attribute))
      .forEach(a => extension.addChild(a));
    const extensionNode = this.create(
      extension,
      this.genTreeLevel(extension.children),
      this
    );

    // add child nodes to the extension node
    this.childNodes = [...this.childNodes!, extensionNode];
    return extensionNode;
  }

  removeItem(item: ITreeNode<Attribute>) {
    const deleted = item.nodeData!;
    this.nodeData.removeItem(deleted);

    this.childNodes = this.childNodes?.filter(
      child => child.id !== deleted.tail
    );

    if (!deleted.isSlice && this.childNodes?.length === 0) {
      // If only one child is left, we simply rebuild an empty one
      // if the item is a slice, we don't want to rebuild an empty one.
      this.addItem();
    }
  }
}
