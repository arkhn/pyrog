import { Button, FormGroup, ControlGroup } from "@blueprintjs/core";
import React from "react";
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useSelector } from "react-redux";

import { IReduxStore } from "src/types";
import AddResourceSelect from "src/components/selects/addResourceSelect";

const qAvailableResources = require("src/graphql/queries/availableResources.graphql");
const qResourcesForSource = require("src/graphql/queries/resourcesForSource.graphql");
const mCreateResource = require("src/graphql/mutations/createResource.graphql");

interface IProps {
  callback: any;
}

const AddResource = ({ callback }: IProps) => {

  // Hooking mutation
  const onCompleted = (data: any) => {
    toaster.show({
      icon: "layout-hierarchy",
      intent: "success",
      message: `Ressource ${
        data.createResource.fhirType
        } créée pour ${selectedNode.source.name}.`,
      timeout: 4000
    })

    setSelectedAddResource(data.createResource.fhirType)
    callback()
  }

  const onError = (error: any) => {
    toaster.show({
      icon: "error",
      intent: "danger",
      message: error.message,
      timeout: 4000
    })
  }

  const addResourceToCache = (cache: any, { data: { createResource } }: any) => {
    try {
      const { source } = cache.readQuery({
        query: qResourcesForSource,
        variables: {
          sourceId: selectedNode.source.id,
        }
      });
      cache.writeQuery({
        query: qResourcesForSource,
        variables: {
          sourceId: selectedNode.source.id,
        },
        data: {
          source: {
            ...source,
            resources: source.resources.concat([createResource])
          }
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  const [
    createResource,
    { loading: creatingResource }
  ] = useMutation(
    mCreateResource,
    { onCompleted, onError, update: addResourceToCache }
  );
  const { loading: loadingAvailableResources, data } = useQuery(qAvailableResources);

  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const [selectedAddResource, setSelectedAddResource] = React.useState("");

  return (
    <FormGroup label={"Add Resource"}>
      <ControlGroup>
        <AddResourceSelect
          loading={loadingAvailableResources}
          disabled={!selectedNode.source}
          intent={null}
          inputItem={selectedAddResource}
          items={loadingAvailableResources ? [] : data.availableResources}
          onChange={(resource: any) => {
            setSelectedAddResource(resource);
          }}
        />
        <Button
          loading={creatingResource}
          icon={"plus"}
          disabled={!selectedAddResource}
          onClick={() => {
            createResource({
              variables: {
                sourceId: selectedNode.source.id,
                resourceName: selectedAddResource
              },
            });
          }}
        />
      </ControlGroup>
    </FormGroup>
  );
};

export default AddResource;
