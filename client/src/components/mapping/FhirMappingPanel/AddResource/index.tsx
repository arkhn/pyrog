import { Button, FormGroup, ControlGroup } from '@blueprintjs/core';
import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import axios from 'axios';

import { IReduxStore } from 'types';
import AddResourceSelect from 'components/selects/addResourceSelect';
import { loader } from 'graphql.macro';
import { FHIR_API_URL } from '../../../../constants';

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
  const [loadingDefinitions, setLoadingDefinitions] = React.useState(false);
  const [definitions, setDefinitions] = React.useState([] as any[]);

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

  React.useEffect(() => {
    const fetchDefinitions = async () => {
      setLoadingDefinitions(true);
      const { data } = await axios.get(`${FHIR_API_URL!}/StructureDefinition`, {
        params: { derivation: 'specialization', kind: 'resource' }
      });
      setDefinitions(data.items);
      setLoadingDefinitions(false);
    };
    fetchDefinitions();
  }, []);

  return (
    <FormGroup label={'Add Resource'}>
      <ControlGroup>
        <AddResourceSelect
          loading={loadingDefinitions}
          disabled={!source}
          inputItem={selectedResource.name ? selectedResource.name : ''}
          items={loadingDefinitions ? [] : definitions.map(d => d.name)}
          onChange={(resource: any) => {
            setSelectedResource(
              definitions.find((el: any) => el.name === resource)
            );
          }}
        />
        <Button
          loading={creatingResource}
          icon={'plus'}
          disabled={!selectedResource.name}
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
