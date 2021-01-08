import { IReduxStore, Owner, SerializedOwner } from 'types';

const formatOwner = (o: SerializedOwner | undefined): Owner | undefined =>
  o && {
    ...o,
    schema: JSON.parse(o.schema as any)
  };

export const getDatabaseOwners = (state: IReduxStore): Owner[] =>
  state.selectedNode.source.credential.owners.map(o => formatOwner(o)!);

export const getResourcePrimaryKeyOwner = (
  state: IReduxStore
): Owner | undefined =>
  formatOwner(state.selectedNode.resource?.primaryKeyOwner);
