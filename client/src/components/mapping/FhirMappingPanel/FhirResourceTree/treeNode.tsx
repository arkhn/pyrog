import { IconName } from '@blueprintjs/core';
import { Icon, ITreeNode } from '@blueprintjs/core';
import React from 'react';

import { Attribute } from '@arkhn/fhir.ts';

// ACTIONS

import { NodeLabel } from './nodeLabel';
import { IStructureDefinition } from 'types';

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
  existingAttributes: any;
  onAddExtension: Function;
  onAddItem: Function;
  onAddSlice: Function;
  onDeleteItem: Function;
  genTreeLevel: Function;

  constructor(
    attribute: Attribute,
    childNodes: ITreeNode<Attribute>[],
    onAddExtension: Function,
    onAddItem: Function,
    onAddSlice: Function,
    onDeleteItem: Function,
    genTreeLevel: Function,
    existingAttributes: any,
    parentArray?: ITreeNode<Attribute>
  ) {
    this.id = attribute.tail;
    this.nodeData = attribute;
    this.childNodes = childNodes;
    this.hasCaret = !attribute.isPrimitive || attribute.isArray;
    this.icon = attribute.isArray
      ? 'multi-select'
      : !attribute.isPrimitive
      ? 'folder-open'
      : 'tag';
    this.existingAttributes = existingAttributes;
    this.secondaryLabel = this.buildSecondaryLabel(attribute, childNodes);
    this.label = (
      <NodeLabel
        attribute={attribute}
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
      this.onAddExtension,
      this.onAddItem,
      this.onAddSlice,
      this.onDeleteItem,
      this.genTreeLevel,
      this.existingAttributes,
      array
    );
  }

  checkHasChildAttributes(pathString: string) {
    return Object.keys(this.existingAttributes).some(el =>
      el.startsWith(pathString)
    );
  }

  checkHasAttribute(pathString: string) {
    return Object.keys(this.existingAttributes).includes(pathString);
  }

  buildSecondaryLabel(
    attribute: Attribute,
    childNodes: ITreeNode<Attribute>[]
  ): React.ReactElement | undefined {
    const hasInputs = this.checkHasAttribute(attribute.path);

    let hasChildAttributes: boolean;
    if (attribute.types.length > 1) {
      // Check if any of the children have child attributes
      hasChildAttributes = childNodes.some(n =>
        this.checkHasChildAttributes(n.nodeData!.path)
      );
    } else {
      hasChildAttributes = this.checkHasChildAttributes(attribute.path);
    }

    if (hasInputs && attribute.isPrimitive)
      return <Icon icon="small-tick" intent={'success'} />;
    else if (attribute.isRequired) return <Icon icon="dot" intent="warning" />;
    else if (hasChildAttributes || hasInputs) return <Icon icon="dot" />;
    else return undefined;
  }

  updateSecondaryLabel() {
    if (!this.nodeData) return;
    this.secondaryLabel = this.buildSecondaryLabel(
      this.nodeData,
      this.childNodes || []
    );
    this.childNodes?.forEach(child =>
      (child as TreeNode).updateSecondaryLabel()
    );
  }

  addItem(index?: number) {
    const item = this.nodeData.addItem(index);
    const nodeItem = this.create(
      item,
      this.genTreeLevel([...item.children, ...item.choices]),
      this
    );
    this.childNodes?.push(nodeItem);
    return nodeItem;
  }

  addSlice(sliceName: string, index?: number) {
    if (sliceName === 'default') {
      this.addItem(index);
    } else {
      const item = this.nodeData.slices.find(
        s => s.definition.sliceName === sliceName
      )!;
      const nodeItem = this.create(
        item,
        this.genTreeLevel([...item.children, ...item.choices]),
        this
      );
      this.childNodes?.push(nodeItem);
      return nodeItem;
    }
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

    // if the attribute has an extension child,
    // append the extension attribute to the array node
    const extension = this.nodeData.parent!.addExtension(
      extensionDefinition.id,
      index
    );
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

    if (this.childNodes?.length === 0) {
      // If only one child is left, we simply rebuild an empty one
      this.addItem();
    }
  }
}
