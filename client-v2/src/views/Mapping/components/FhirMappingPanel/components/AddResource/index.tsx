import { Button, FormGroup, ControlGroup } from "@blueprintjs/core";
import React from "react";
import { useMutation } from '@apollo/react-hooks';
import { useSelector } from "react-redux";

import { IReduxStore } from "src/types";
import { availableResourceNames } from "./resourceNames";
import AddResourceSelect from "src/components/selects/addResourceSelect";

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

    setSelectedAddResource({
      type: null,
      subtype: null,
      name: null
    })
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

  const [
    createResource,
    { loading: creatingResource }
  ] = useMutation(mCreateResource, { onCompleted, onError });

  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const [selectedAddResource, setSelectedAddResource] = React.useState({
    type: null,
    subtype: null,
    name: null
  });

  return (
    <FormGroup label={"Add Resource"}>
      <ControlGroup>
        <AddResourceSelect
          disabled={!selectedNode.source}
          intent={null}
          inputItem={selectedAddResource}
          items={availableResourceNames}
          onChange={(resource: any) => {
            setSelectedAddResource(resource);
          }}
        />
        <Button
          loading={creatingResource}
          icon={"plus"}
          onClick={() => {
            createResource({
              variables: {
                sourceId: selectedNode.source.id,
                resourceName: selectedAddResource.name
              },
            });
          }}
        />
      </ControlGroup>
    </FormGroup>
  );
};

export default AddResource;
