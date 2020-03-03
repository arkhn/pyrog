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
import { ApolloError } from 'apollo-client/errors/ApolloError';

import { IReduxStore, ISelectedResource, ISourceColumn } from 'types';
import ColumnPicker from 'components/mapping/ColumnPicker';
import {
  updateSelectedResource,
  deselectResource
} from 'services/selectedNode/actions';

import './style.scss';
import StringSelect from 'components/selects/stringSelect';

interface Filter {
  sqlColumn: ISourceColumn;
  relation: string;
  value: string;
}

interface Props {
  resource: ISelectedResource;
  isOpen: boolean;
  deleteResourceCallback: () => void;
  onCloseCallback?: () => void;
}

// GRAPHQL
const qResourcesForSource = loader(
  'src/graphql/queries/resourcesForSource.graphql'
);
const mDeleteResource = loader('src/graphql/mutations/deleteResource.graphql');
const mUpdateResource = loader('src/graphql/mutations/updateResource.graphql');

const Drawer = ({
  resource,
  isOpen,
  deleteResourceCallback,
  onCloseCallback
}: Props): ReactElement => {
  const dispatch = useDispatch();
  const { source } = useSelector((state: IReduxStore) => state.selectedNode);

  const toaster = useSelector((state: IReduxStore) => state.toaster);

  const [label, setLabel] = React.useState('');
  const [pkOwner, setPkOwner] = React.useState('');
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

  const onUpdateError = (): void => {
    toaster.show({
      message: 'An error occurred while updating properties',
      intent: 'danger',
      icon: 'properties'
    });
  };

  const [updateResource, { loading: updatingResource }] = useMutation(
    mUpdateResource,
    {
      onCompleted: onUpdateCompleted,
      onError: onUpdateError
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
    setPkOwner(resource.primaryKeyOwner || '');
    setPkTable(resource.primaryKeyTable || '');
    setPkColumn(resource.primaryKeyColumn || '');
    setFilters(resource.filters || []);
  }, [resource]);

  const onFormSubmit = (e: React.FormEvent<HTMLElement>): void => {
    e.preventDefault();

    updateResource({
      variables: {
        resourceId: resource.id,
        data: {
          label,
          primaryKeyOwner: pkOwner,
          primaryKeyTable: pkTable,
          primaryKeyColumn: pkColumn
        },
        filters
      }
    });
    dispatch(
      updateSelectedResource({
        ...resource,
        label,
        primaryKeyOwner: pkOwner,
        primaryKeyTable: pkTable,
        primaryKeyColumn: pkColumn,
        filters
      })
    );
  };

  const onDeletionCompleted = (): void => {
    toaster.show({
      icon: 'layout-hierarchy',
      intent: 'success',
      message: 'Resource deleted.',
      timeout: 4000
    });
    dispatch(deselectResource());
    deleteResourceCallback();
  };

  const onDeletionError = (error: ApolloError): void => {
    toaster.show({
      icon: 'error',
      intent: 'danger',
      message: error.message,
      timeout: 4000
    });
    deleteResourceCallback();
  };

  const removeResourceFromCache = (
    cache: any,
    { data: { deleteResource } }: any
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
          (r: any) => r.id !== deleteResource.id
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

  const [deleteResource, { loading: deletingResource }] = useMutation(
    mDeleteResource,
    {
      update: removeResourceFromCache,
      onCompleted: onDeletionCompleted,
      onError: onDeletionError
    }
  );

  const pickPrimaryKey = (
    <FormGroup label="Primary Key" disabled={updatingResource || !resource}>
      <ColumnPicker
        hasOwner={source ? source.hasOwner : undefined}
        ownerChangeCallback={(owner: string): void => {
          setPkOwner(owner);
          setPkTable('');
          setPkColumn('');
        }}
        tableChangeCallback={(table: string): void => {
          setPkTable(table);
          setPkColumn('');
        }}
        columnChangeCallback={(column: string): void => {
          setPkColumn(column);
        }}
        initialColumn={{
          owner: pkOwner,
          table: pkTable,
          column: pkColumn
        }}
        sourceSchema={source.schema!}
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
                <ColumnPicker
                  hasOwner={source ? source.hasOwner : undefined}
                  ownerChangeCallback={(owner: string): void => {
                    filters[index].sqlColumn.owner = owner;
                    filters[index].sqlColumn.table = '';
                    filters[index].sqlColumn.column = '';
                    setFilters([...filters]);
                  }}
                  tableChangeCallback={(table: string): void => {
                    filters[index].sqlColumn.table = table;
                    filters[index].sqlColumn.column = '';
                    setFilters([...filters]);
                  }}
                  columnChangeCallback={(column: string): void => {
                    filters[index].sqlColumn.column = column;
                    setFilters([...filters]);
                  }}
                  initialColumn={{
                    owner: sqlColumn ? sqlColumn.owner : '',
                    table: sqlColumn ? sqlColumn.table : '',
                    column: sqlColumn ? sqlColumn.column : ''
                  }}
                  sourceSchema={source.schema!}
                  vertical={true}
                  fill={true}
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
              <td>
                <StringSelect
                  inputItem={relation}
                  items={sqlRelations}
                  displayItem={(r: string): string => r || 'select relation'}
                  onChange={(relation: string): void => {
                    filters[index].relation = relation;
                    setFilters([...filters]);
                  }}
                />
              </td>
              <td>
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
              sqlColumn: { owner: '', table: '', column: '' },
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
            onClick={() => {
              deleteResource({
                variables: {
                  id: resource.id
                }
              });
            }}
            text="Delete Resource"
          />
        </ControlGroup>
      </div>
    </BPDrawer>
  );
};

export default Drawer;
