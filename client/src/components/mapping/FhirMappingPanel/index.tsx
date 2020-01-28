import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import useReactRouter from 'use-react-router';

// ACTIONS
import { updateFhirAttribute } from 'services/selectedNode/actions';

// COMPONENTS
import AddResource from './AddResource';
import FhirResourceTree from './FhirResourceTree';
import ResourceSelector from './ResourceSelector';

import { IReduxStore } from 'types';

import { updateLocationParams } from 'services/urlState';
import { loader } from 'graphql.macro';

// GRAPHQL
const qResourcesForSource = loader(
  'src/graphql/queries/resourcesForSource.graphql'
);

const FhirMappingPanel = () => {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const { history, location } = useReactRouter();

  const [createdResources, setCreatedResources] = React.useState(0);

  const { data: dataResources, loading: loadingResources } = useQuery(
    qResourcesForSource,
    {
      skip: !selectedNode.source.id,
      variables: {
        sourceId: selectedNode.source.id
      }
    }
  );

  const renderResourceTree = () => {
    return (
      <div id="fhir-resource-tree">
        <FhirResourceTree
          onClickCallback={(nodeData: any) => {
            dispatch(updateFhirAttribute(nodeData.path));
            updateLocationParams(history, location, 'attributeId', nodeData.id);
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
            deleteResourceCallback={() => {
              setCreatedResources(createdResources - 1);
            }}
          />
        </div>
        {selectedNode.resource && renderResourceTree()}
      </div>
      <div id="resource-add">
        <AddResource
          callback={() => {
            setCreatedResources(createdResources + 1);
          }}
        />
      </div>
    </>
  );
};

export default FhirMappingPanel;
