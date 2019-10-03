import { Button, FormGroup, ControlGroup } from "@blueprintjs/core";
import * as React from "react";
import { Mutation } from "react-apollo";
import { useSelector } from "react-redux";

import { IReduxStore } from "../../../../../../types";
import { availableResourceNames } from "./resourceNames";
import AddResourceSelect from "../../../../../../components/selects/addResourceSelect";

const createResourceTreeInSource = require("../../../../../../graphql/mutations/createResourceTreeInSource.graphql");

interface IProps {
  callback: any;
}

const AddResource = ({ callback }: IProps) => {
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
        <Mutation
          mutation={createResourceTreeInSource}
          onCompleted={(data: any) => {
            toaster.show({
              icon: "layout-hierarchy",
              intent: "success",
              message: `Ressource ${
                data.createResourceTreeInSource.fhirType
              } créée pour ${selectedNode.source.name}.`,
              timeout: 4000
            });

            setSelectedAddResource({
              type: null,
              subtype: null,
              name: null
            });
            callback();
          }}
          onError={(error: any) => {
            toaster.show({
              icon: "error",
              intent: "danger",
              message: error.message,
              timeout: 4000
            });
          }}
        >
          {(createResource: any, { loading }: any) => {
            return (
              <Button
                loading={loading}
                icon={"plus"}
                onClick={() => {
                  createResource({
                    variables: {
                      sourceId: selectedNode.source.id,
                      resourceName: selectedAddResource.name
                    }
                  });
                }}
              />
            );
          }}
        </Mutation>
      </ControlGroup>
    </FormGroup>
  );
};

export default AddResource;
