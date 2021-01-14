import { Button, FormGroup, ControlGroup } from '@blueprintjs/core';
import React, { useEffect } from 'react';
import axios from 'axios';
import { useMutation } from '@apollo/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceDefinition } from '@arkhn/fhir.ts';

import AddResourceSelect from 'components/selects/addResourceSelect';
import { changeSelectedResource } from 'services/selectedNode/actions';
import { initAttributesMap } from 'services/resourceInputs/actions';
import { onError } from 'services/apollo';
import { IReduxStore } from 'types';
import { loader } from 'graphql.macro';

import { FHIR_API_URL } from '../../../../constants';
import { fetchAvailableResources } from 'services/fhir';
import { useSnackbar } from 'notistack';

const qResourcesForSource = loader(
  'src/graphql/queries/resourcesForSource.graphql'
);
const mCreateResource = loader('src/graphql/mutations/createResource.graphql');

const fetchProfiles: (r: ResourceDefinition) => Promise<any[]> = async (
  r: ResourceDefinition
) => {
  let profiles = [];
  try {
    const response = await axios.get(
      `${FHIR_API_URL}/StructureDefinition?type=${r.type}&_count=1000&_elements=id,name,type`
    );
    profiles = response.data?.entry.map(({ resource }: any) => resource);
  } catch (err) {
    console.error(
      `Could not fetch available resources: ${
        err.response ? err.response.data : err.message
      }`
    );
  }
  return profiles;
};

const AddResource = () => {
  const dispatch = useDispatch();

  const { source } = useSelector((state: IReduxStore) => state.selectedNode);
  const { availableResources } = useSelector(
    (state: IReduxStore) => state.fhir
  );
  const { enqueueSnackbar } = useSnackbar();
  const [selectedDefinition, setSelectedDefinition] = React.useState(
    undefined as ResourceDefinition | undefined
  );

  const onCompleted = (data: any) => {
    enqueueSnackbar(
      `Ressource ${data.createResource.definition.type} has been created for ${source.name}.`,
      { variant: 'success' }
    );
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
      onError: onError(enqueueSnackbar),
      update: addResourceToCache
    }
  );

  const onAdd = async () => {
    // Create the new resource
    const responseCreateResource = await createResource({
      variables: {
        sourceId: source.id,
        definitionId: selectedDefinition!.id
      }
    });
    if (responseCreateResource) {
      // Update Redux store
      dispatch(initAttributesMap([]));
      dispatch(
        changeSelectedResource(responseCreateResource.data.createResource)
      );
    }
  };

  useEffect(() => {
    dispatch(fetchAvailableResources);
  }, [dispatch]);

  return (
    <FormGroup>
      <ControlGroup>
        <AddResourceSelect
          loading={!availableResources || availableResources.length === 0}
          disabled={!source}
          inputItem={selectedDefinition}
          items={availableResources}
          onChange={(r: ResourceDefinition) => {
            setSelectedDefinition(r);
          }}
          fetchProfiles={fetchProfiles}
        />
        <Button
          loading={creatingResource}
          icon={'plus'}
          disabled={!selectedDefinition}
          onClick={onAdd}
        />
      </ControlGroup>
    </FormGroup>
  );
};

export default AddResource;
