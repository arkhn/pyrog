import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import useReactRouter from 'use-react-router';

// ACTIONS
import { updateFhirAttribute } from 'src/services/selectedNode/actions';

// COMPONENTS
import AddResource from './AddResource';
import FhirResourceTree from './FhirResourceTree';
import ResourceSelector from './ResourceSelector';

import { IReduxStore } from 'src/types';

import { updateLocationParams } from 'src/services/urlState';
import { loader } from 'graphql.macro';


// GRAPHQL
const qResourcesForSource = loader(
  'src/graphql/queries/resourcesForSource.graphql'
);

const FhirMappingPanel = () => {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const { history, location } = useReactRouter();

  const [
    expandedAttributesIdList,
    setExpandedAttributesIdList
  ] = React.useState([] as string[]);
  const [createdResources, setCreatedResources] = React.useState(0);

  const { data: dataResources, loading: loadingResources } = useQuery(
    qResourcesForSource,
    {
      skip: !selectedNode.source,
      variables: {
        sourceId: selectedNode.source.id
      }
    }
  );

  const renderResourceTree = () => {
    return (
      <div id="fhir-resource-tree">
        <FhirResourceTree
          expandedAttributesIdList={expandedAttributesIdList}
          nodeCollapseCallback={(node: any) => {
            setExpandedAttributesIdList(
              expandedAttributesIdList.filter(
                (item: any) => item !== node.nodeData.id
              )
            );
          }}
          nodeExpandCallback={(node: any) => {
            setExpandedAttributesIdList([
              ...expandedAttributesIdList,
              node.nodeData.id
            ]);
          }}
          onClickCallback={(nodeData: any) => {
            dispatch(updateFhirAttribute(nodeData.id, nodeData.name));
            updateLocationParams(history, location, 'attributeId', nodeData.id);
          }}
          selectedAttributeId={
            selectedNode.attribute && selectedNode.attribute.id
          }
        />
      </div>
    );
  };

  return (
    <>
      <div id="fhir-attributes">
        <div id="resource-selector">
          <ResourceSelector
            availableResources={
              loadingResources ? [] : dataResources.source.resources
            }
            loading={loadingResources}
            deleteResourceCallback={() => {
              setCreatedResources(createdResources - 1);
            }}
          />
        </div>
        {selectedNode.resource.id && renderResourceTree()}
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
