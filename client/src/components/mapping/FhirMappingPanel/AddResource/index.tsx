import { Button, FormGroup, ControlGroup } from '@blueprintjs/core';
import React from 'react';
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';
import { useDispatch, useSelector } from 'react-redux';

import AddResourceSelect from 'components/selects/addResourceSelect';
import { changeSelectedResource } from 'services/selectedNode/actions';
import { initAttributesMap } from 'services/resourceInputs/actions';
import { IReduxStore, Resource } from 'types';
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

const qResourceAttributes = loader(
  'src/graphql/queries/resourceAttributes.graphql'
);

const AddResource = ({ callback }: Props) => {
  const client = useApolloClient();
  const dispatch = useDispatch();

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

  const onAdd = async () => {
    await refreshDefinition({
      variables: { definitionId: selectedResource!.id }
    });

    // Create the new resource
    const {
      data: { createResource: createdResource }
    } = await createResource({
      variables: {
        sourceId: source.id,
        definitionId: selectedResource!.id
      }
    });

    // Update Redux store
    dispatch(initAttributesMap([]));
    dispatch(changeSelectedResource(createdResource));
  };

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
          onClick={onAdd}
        />
      </ControlGroup>
    </FormGroup>
  );
};

export default AddResource;
