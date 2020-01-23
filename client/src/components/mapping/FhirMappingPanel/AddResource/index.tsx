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

interface IProps {
  callback: any;
}

const AddResource = ({ callback }: IProps) => {
  // Hooking mutation
  const onCompleted = (data: any) => {
    toaster.show({
      icon: 'layout-hierarchy',
      intent: 'success',
      message: `Ressource ${data.createResource.definition.type} créée pour ${selectedNode.source.name}.`,
      timeout: 4000
    });

    // setSelectedResourceId(data.createResource.fhirType);
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
      const { source } = cache.readQuery({
        query: qResourcesForSource,
        variables: {
          sourceId: selectedNode.source.id
        }
      });
      cache.writeQuery({
        query: qResourcesForSource,
        variables: {
          sourceId: selectedNode.source.id
        },
        data: {
          source: {
            ...source,
            resources: source.resources.concat([createResource])
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
  const { loading: loadingAvailableResources, data } = useQuery(
    qAvailableResources
  );

  const resourceNames = data
    ? data.structureDefinitions.map((el: any) => el.name)
    : []

  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const [selectedResource, setSelectedResource] = React.useState({id:'', name: ''});

  return (
    <FormGroup label={'Add Resource'}>
      <ControlGroup>
        <AddResourceSelect
          loading={loadingAvailableResources}
          disabled={!selectedNode.source}
          inputItem={selectedResource.name}
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
          disabled={!selectedResource.id}
          onClick={() => {
            createResource({
              variables: {
                sourceId: selectedNode.source.id,
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
