const toCamelCase = (s: string) => s[0].toUpperCase() + s.slice(1);

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

export class Node {
  parent?: Node;

  isArray: boolean;
  isRequired: boolean;
  isPrimitive: boolean;
  isReferenceType: boolean;
  definition: any;
  types: string[];
  index?: number;
  path: string;

  constructor(parent?: Node, definition?: any, index?: number) {
    this.parent = parent;

    this.definition = definition;
    this.index = index;
    this.isArray = index === undefined && definition.max !== '1';
    this.isRequired = definition.min > 0;
    this.types = definition.type
      ? definition.type.map((type: any) => type.code)
      : [];
    this.isPrimitive =
      this.types.length > 1
        ? false
        : primitiveTypes.includes(this.types[0])
        ? true
        : false;
    this.isReferenceType =
      this.types[0] === 'uri' && this.parent?.types[0] === 'Reference';
    // add path because method can't be use when object is stored in redux
    this.path = this.serialize();
  }

  isChild(p: Node) {
    let current = this as Node | undefined;
    while (current) {
      if (current.equals(p)) return true;
      current = current.parent;
    }
    return false;
  }

  equals(p: Node) {
    return this.serialize() === p.serialize();
  }

  tail(): string {
    // if element has an index, return the index in brackets
    if (this.parent?.isArray) return `[${this.index}]`;

    if (
      this.definition.sliceName &&
      this.parent?.definition.name.includes('[x]')
    ) {
      return this.definition.sliceName;
    }

    // if the parent has multiple types, use the type in camelCase
    if (this.parent && this.parent.types.length > 1)
      return this.definition.name.replace(
        '[x]',
        toCamelCase(this.definition.type[0].code)
      );

    return this.definition.name || '';
  }

  serialize(): string {
    // if not parent, return the definitionId
    if (!this.parent) {
      return this.tail();
    }

    if (this.parent.isArray) {
      return `${this.parent.serialize()}${this.tail()}`;
    }

    // if parent is a multi-type node, we don't want to render the parent
    if (
      this.parent.types.length > 1 ||
      (this.parent.definition.slicing &&
        this.parent.definition.name.includes('[x]'))
    ) {
      return this.parent.parent
        ? `${this.parent.parent.serialize()}.${this.tail()}`
        : this.tail();
    }

    // else, join the parent to the current element with a '.'
    return `${this.parent.serialize()}.${this.tail()}`;
  }
}
