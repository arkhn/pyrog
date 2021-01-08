import {
  InputGroup,
  FormGroup,
  Button,
  Classes,
  Drawer as BPDrawer,
  ControlGroup,
  Position
} from '@blueprintjs/core';
import React, { ReactElement } from 'react';
import { loader } from 'graphql.macro';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';

import {
  Column,
  Filter,
  IReduxStore,
  Join,
  Owner,
  SerializedOwner
} from 'types';
import ColumnSelect from 'components/selects/columnSelect';
import {
  updateSelectedResource,
  deselectResource
} from 'services/selectedNode/actions';
import { onError } from 'services/apollo';

import './style.scss';
import StringSelect from 'components/selects/stringSelect';
import {
  getDatabaseOwners,
  getResourcePrimaryKeyOwner
} from 'services/selectedNode/selectors';

interface Props {
  isOpen: boolean;
  onCloseCallback?: () => void;
}

// GRAPHQL
const qResourcesForSource = loader(
  'src/graphql/queries/resourcesForSource.graphql'
);
const mDeleteResource = loader('src/graphql/mutations/deleteResource.graphql');
const mUpdateResource = loader('src/graphql/mutations/updateResource.graphql');

const Drawer = ({ isOpen, onCloseCallback }: Props): ReactElement => {
  const dispatch = useDispatch();
  const { source, resource } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );
  const resourcePkOwner = useSelector(getResourcePrimaryKeyOwner);
  const availableOwners = useSelector(getDatabaseOwners);

  const toaster = useSelector((state: IReduxStore) => state.toaster);

  const [label, setLabel] = React.useState('');
  const [pkOwner, setPkOwner] = React.useState(undefined as Owner | undefined);
  const [pkTable, setPkTable] = React.useState('');
  const [pkColumn, setPkColumn] = React.useState('');
  const [filters, setFilters] = React.useState([] as Filter[]);

  const onUpdateCompleted = (): void => {
    toaster.show({
      message: `Successfully updated ${resource.definition.type} properties`,
      intent: 'success',
      icon: 'properties'
    });
  };

  const onDeletionCompleted = (): void => {
    toaster.show({
      icon: 'layout-hierarchy',
      intent: 'success',
      message: 'Resource deleted.',
      timeout: 4000
    });
    dispatch(deselectResource());
  };

  const removeResourceFromCache = (
    cache: any,
    { data: { dataDeleteResource } }: any
  ): void => {
    try {
      const { source: cachedSource } = cache.readQuery({
        query: qResourcesForSource,
        variables: {
          sourceId: source.id
        }
      });
      const newSource = {
        ...cachedSource,
        resources: cachedSource.resources.filter(
          (r: any) => r.id !== dataDeleteResource.id
        )
      };
      cache.writeQuery({
        query: qResourcesForSource,
        variables: {
          sourceId: source.id
        },
        data: { source: newSource }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [updateResource, { loading: updatingResource }] = useMutation(
    mUpdateResource,
    {
      onCompleted: onUpdateCompleted,
      onError: onError(toaster)
    }
  );

  const [deleteResource, { loading: deletingResource }] = useMutation(
    mDeleteResource,
    {
      update: removeResourceFromCache,
      onCompleted: onDeletionCompleted,
      onError: onError(toaster)
    }
  );

  // TODO add more relations
  const sqlRelations = [
    '=',
    '>',
    '<',
    '>=',
    '<=',
    '<>',
    'BETWEEN',
    'LIKE',
    'IN'
  ];

  React.useEffect(() => {
    setLabel(resource.label || '');
    setPkOwner(resourcePkOwner);
    setPkTable(resource.primaryKeyTable || '');
    setPkColumn(resource.primaryKeyColumn || '');
    setFilters(resource.filters || []);
  }, [resource, resourcePkOwner]);

  const onFormSubmit = (e: React.FormEvent<HTMLElement>): void => {
    e.preventDefault();
    const updatedResource = updateResource({
      variables: {
        resourceId: resource.id,
        data: {
          label,
          primaryKeyOwner: pkOwner ? { id: pkOwner.id } : undefined,
          primaryKeyTable: pkTable,
          primaryKeyColumn: pkColumn
        },
        filters: filters.map(filter => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { __typename, ...sqlColumn } = filter.sqlColumn as any;
          return {
            sqlColumn: {
              ...sqlColumn,
              owner: sqlColumn.owner ? { id: sqlColumn.owner.id } : undefined
            },
            relation: filter.relation,
            value: filter.value
          };
        })
      }
    });
    if (updatedResource) {
      dispatch(
        updateSelectedResource({
          ...resource,
          label,
          primaryKeyOwner: {
            ...pkOwner,
            schema: JSON.stringify(pkOwner?.schema)
          } as SerializedOwner,
          primaryKeyTable: pkTable,
          primaryKeyColumn: pkColumn,
          filters
        })
      );
    }
  };

  const onClickDelete = (): void => {
    deleteResource({
      variables: {
        resourceId: resource.id
      }
    });
  };

  const pickPrimaryKey = (
    <FormGroup label="Primary Key" disabled={updatingResource || !resource}>
      <ColumnSelect
        columnChangeCallback={({ owner, table, column }: Column): void => {
          setPkOwner(owner);
          setPkTable(table);
          setPkColumn(column);
        }}
        initialOwner={pkOwner}
        initialTable={pkTable}
        initialColumn={pkColumn}
        sourceOwners={availableOwners}
        popoverProps={{
          autoFocus: true,
          boundary: 'viewport',
          canEscapeKeyClose: true,
          lazy: true,
          position: Position.LEFT_TOP,
          usePortal: true
        }}
        disabled={updatingResource || !resource}
      />
    </FormGroup>
  );

  const deleteFilterButton = (index: number): ReactElement => (
    <Button
      icon="trash"
      minimal={true}
      onClick={(): void => {
        filters.splice(index, 1);
        setFilters([...filters]);
      }}
    />
  );

  const renderFiltersForm = (
    <FormGroup
      className="filters-form"
      label="Filters"
      disabled={updatingResource || !resource}
    >
      <table className="bp3-html-table">
        <tbody>
          {filters.map(({ sqlColumn, relation, value }, index) => (
            <tr key={index}>
              <td>{deleteFilterButton(index)}</td>
              <td>
                <ColumnSelect
                  columnChangeCallback={(column: Column): void => {
                    filters[index].sqlColumn = column;
                    setFilters([...filters]);
                  }}
                  allJoinsChangeCallback={(joins: Join[]): void => {
                    filters[index].sqlColumn.joins = joins;
                    setFilters([...filters]);
                  }}
                  initialOwner={sqlColumn ? sqlColumn.owner : undefined}
                  initialTable={sqlColumn ? sqlColumn.table : ''}
                  initialColumn={sqlColumn ? sqlColumn.column : ''}
                  sourceOwners={availableOwners}
                  fill={true}
                  vertical={true}
                  initialJoins={filters[index].sqlColumn.joins}
                  primaryKeyTable={pkTable}
                  popoverProps={{
                    autoFocus: true,
                    boundary: 'viewport',
                    canEscapeKeyClose: true,
                    lazy: true,
                    position: Position.LEFT_TOP,
                    usePortal: true
                  }}
                  disabled={updatingResource || !resource}
                />
              </td>
              <td className="align-top">
                <StringSelect
                  inputItem={relation}
                  items={sqlRelations}
                  displayItem={(rel: string): string =>
                    rel || 'select relation'
                  }
                  onChange={(rel: string): void => {
                    filters[index].relation = rel;
                    setFilters([...filters]);
                  }}
                />
              </td>
              <td className="align-top">
                <input
                  className="bp3-input"
                  type="text"
                  placeholder="Text input"
                  value={value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                    filters[index].value = e.target.value;
                    setFilters([...filters]);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button
        disabled={!resource}
        loading={deletingResource}
        icon={'add'}
        onClick={() => {
          setFilters(prev => [
            ...prev,
            {
              sqlColumn: { owner: undefined, table: '', column: '' },
              relation: '',
              value: ''
            }
          ]);
        }}
        text="Add filter"
      />
    </FormGroup>
  );

  return (
    <BPDrawer
      title={resource.definition ? resource.definition.type : ''}
      icon={resource.definition ? 'properties' : null}
      isOpen={isOpen}
      onClose={onCloseCallback}
      position={Position.LEFT}
    >
      <div className={Classes.DRAWER_BODY}>
        <div className={Classes.DIALOG_BODY}>
          <form onSubmit={onFormSubmit}>
            <FormGroup
              label="Resource Label"
              className="resource-info"
              disabled={updatingResource || !resource}
            >
              <InputGroup
                type="text"
                placeholder="Label..."
                value={label}
                onChange={(event: React.FormEvent<HTMLElement>) => {
                  setLabel((event.target as any).value);
                }}
              />
            </FormGroup>
            {pickPrimaryKey}
            {renderFiltersForm}
            <Button
              disabled={updatingResource || !resource}
              intent="primary"
              text="Save"
              type="submit"
            />
          </form>
        </div>
      </div>
      <div className={Classes.DRAWER_FOOTER}>
        <ControlGroup fill={true}>
          <Button
            disabled={!resource}
            loading={deletingResource}
            icon={'trash'}
            intent={'danger'}
            onClick={onClickDelete}
            text="Delete Resource"
          />
        </ControlGroup>
      </div>
    </BPDrawer>
  );
};

export default Drawer;
