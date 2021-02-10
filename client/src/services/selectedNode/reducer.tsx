import { ISimpleAction, Owner, SerializedOwner } from 'types';

const formatOwner = (o: SerializedOwner | undefined): Owner | undefined =>
  o && {
    ...o,
    schema: JSON.parse(o.schema as any)
  };

const initialState: any = {
  source: null,
  resource: null,
  attribute: null
};

const selectedNodeReducer = (
  state = initialState,
  action: ISimpleAction
): any => {
  switch (action.type) {
    case 'UPDATE_SOURCE':
      return {
        ...state,
        source: {
          ...action.payload,
          credential: {
            ...action.payload.credential,
            owners: action.payload.credential.owners.map(formatOwner)
          }
        }
      };

    case 'CHANGE_SOURCE':
      return {
        ...initialState,
        source: {
          ...action.payload,
          credential: {
            ...action.payload.credential,
            owners: action.payload.credential.owners.map(formatOwner)
          }
        }
      };

    case 'UPDATE_RESOURCE':
      return {
        ...state,
        resource: {
          ...action.payload.resource,
          primaryKeyOwner:
            action.payload.resource.primaryKeyOwner &&
            formatOwner(action.payload.resource.primaryKeyOwner)
        }
      };

    case 'CHANGE_RESOURCE':
      return {
        ...state,
        resource: {
          ...action.payload.resource,
          primaryKeyOwner:
            action.payload.resource.primaryKeyOwner &&
            formatOwner(action.payload.resource.primaryKeyOwner)
        },
        attribute: null
      };

    case 'UPDATE_ATTRIBUTE':
      return {
        ...state,
        attribute: action.payload.attribute
          ? {
              ...action.payload.attribute,
              path: action.payload.attribute.path
            }
          : null
      };

    case 'DESELECT_SOURCE':
      return {
        ...initialState
      };

    case 'DESELECT_RESOURCE':
      return {
        ...state,
        resource: null,
        attribute: null
      };

    default:
      return state;
  }
};

export default selectedNodeReducer;
