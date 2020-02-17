import { Button, FormGroup, ControlGroup } from '@blueprintjs/core';
import React from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';

import { IReduxStore } from 'types';
import AddResourceSelect from 'components/selects/addResourceSelect';
import { loader } from 'graphql.macro';

const qResourcesForSource = loader(
  'src/graphql/queries/resourcesForSource.graphql'
);
const mCreateResource = loader('src/graphql/mutations/createResource.graphql');
const mRefreshDefinition = loader(
  'src/graphql/mutations/refreshDefinition.graphql'
);
const qAvailableResources = loader(
  'src/graphql/queries/availableResources.graphql'
);

interface Props {
  callback: any;
}

interface Profile {
  id: string;
  name: string;
  type: string;
}
interface Resource {
  id: string;
  name: string;
  type: string;
  profiles: Profile[];
}

const AddResource = ({ callback }: Props) => {
  const { source } = useSelector((state: IReduxStore) => state.selectedNode);
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const [selectedResource, setSelectedResource] = React.useState(
    undefined as Resource | undefined
  );
  const { data, loading } = useQuery(qAvailableResources, {
    fetchPolicy: 'cache-first'
  });
  const [refreshDefinition, { loading: refreshingDefinition }] = useMutation(
    mRefreshDefinition
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
      const { source: cachedSource } = cache.readQuery({
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
            ...cachedSource,
            resources: [...cachedSource.resources, createResource]
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
    <FormGroup>
      <ControlGroup>
        <AddResourceSelect
          loading={loading}
          disabled={!source}
          inputItem={selectedResource}
          items={loading || !data ? [] : data.structureDefinitions}
          onChange={(r: Resource) => {
            setSelectedResource(r);
          }}
        />
        <Button
          loading={creatingResource || refreshingDefinition}
          icon={'plus'}
          disabled={!selectedResource}
          onClick={async () => {
            await refreshDefinition({
              variables: { definitionId: selectedResource!.id }
            });
            createResource({
              variables: {
                sourceId: source.id,
                definitionId: selectedResource!.id
              }
            });
          }}
        />
      </ControlGroup>
    </FormGroup>
  );
};

export default AddResource;
