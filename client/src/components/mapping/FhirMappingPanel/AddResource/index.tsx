import { Button, FormGroup, ControlGroup } from '@blueprintjs/core';
import React from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';

import { IReduxStore } from 'types';
import AddResourceSelect from 'components/selects/addResourceSelect';
import { loader } from 'graphql.macro';

const qAvailableResources = loader(
  'src/graphql/queries/availableResources.graphql'
);
const qResourcesForSource = loader(
  'src/graphql/queries/resourcesForSource.graphql'
);
const mCreateResource = loader('src/graphql/mutations/createResource.graphql');

interface Props {
  callback: any;
}

interface ResourceState {
  id: string;
  name: string;
}

const AddResource = ({ callback }: Props) => {
  const { loading: loadingAvailableResources, data } = useQuery(
    qAvailableResources
  );

  const resourceNames = data
    ? data.structureDefinitions.map((el: any) => el.name)
    : [];

  const { source } = useSelector((state: IReduxStore) => state.selectedNode);
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const [selectedResource, setSelectedResource] = React.useState(
    {} as ResourceState
  );

  const onCompleted = (data: any) => {
    toaster.show({
      icon: 'layout-hierarchy',
      intent: 'success',
      message: `Ressource ${data.createResource.definition.type} créée pour ${source.name}.`,
      timeout: 4000
    });

    callback();
  };

  const onError = (error: any) => {
    toaster.show({
      icon: 'error',
      intent: 'danger',
      message: error.message,
      timeout: 4000
    });
  };

  const addResourceToCache = (
    cache: any,
    { data: { createResource } }: any
  ) => {
    try {
      const { dataSource } = cache.readQuery({
        query: qResourcesForSource,
        variables: {
          sourceId: source.id
        }
      });
      cache.writeQuery({
        query: qResourcesForSource,
        variables: {
          sourceId: source.id
        },
        data: {
          source: {
            ...dataSource,
            resources: dataSource.resources.concat([createResource])
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [createResource, { loading: creatingResource }] = useMutation(
    mCreateResource,
    {
      onCompleted,
      onError,
      update: addResourceToCache
    }
  );

  return (
    <FormGroup label={'Add Resource'}>
      <ControlGroup>
        <AddResourceSelect
          loading={loadingAvailableResources}
          disabled={!source}
          inputItem={selectedResource ? selectedResource.name : ''}
          items={loadingAvailableResources ? [] : resourceNames}
          onChange={(resource: any) => {
            setSelectedResource(
              data.structureDefinitions.find((el: any) => el.name === resource)
            );
          }}
        />
        <Button
          loading={creatingResource}
          icon={'plus'}
          disabled={!selectedResource}
          onClick={() => {
            createResource({
              variables: {
                sourceId: source.id,
                definitionId: selectedResource.id
              }
            });
          }}
        />
      </ControlGroup>
    </FormGroup>
  );
};

export default AddResource;
