import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import { Attribute } from '@arkhn/fhir.ts';

// ACTIONS
import { updateFhirAttribute } from 'services/selectedNode/actions';

// COMPONENTS
import AddResource from './AddResource';
import FhirResourceTree from './FhirResourceTree';
import ResourceSelector from './ResourceSelector';

import { IReduxStore } from 'types';

import { loader } from 'graphql.macro';

// GRAPHQL
const qResourcesForSource = loader(
  'src/graphql/queries/resourcesForSource.graphql'
);

const FhirMappingPanel = () => {
  const dispatch = useDispatch();
  const { source, resource } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );

  const { data: dataResources, loading: loadingResources } = useQuery(
    qResourcesForSource,
    {
      variables: {
        sourceId: source ? source.id : null
      },
      skip: !source
    }
  );

  const renderResourceTree = () => {
    return (
      <div id="fhir-resource-tree">
        <FhirResourceTree
          onClickCallback={(attribute: Attribute) => {
            dispatch(updateFhirAttribute(attribute));
          }}
        />
      </div>
    );
  };

  return (
    <>
      <div id="fhir-attributes">
        <div id="resource-selector">
          <ResourceSelector
            resources={
              loadingResources || !dataResources
                ? []
                : dataResources.source.resources
            }
            loading={loadingResources}
          />
        </div>
        {resource && renderResourceTree()}
      </div>
      <div id="resource-add">
        <AddResource />
      </div>
    </>
  );
};

export default FhirMappingPanel;
