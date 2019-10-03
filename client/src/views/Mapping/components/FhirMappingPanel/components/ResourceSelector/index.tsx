import {
  FormGroup,
  ControlGroup,
  Button,
  InputGroup,
  Spinner,
  Icon
} from "@blueprintjs/core";
import * as QueryString from "query-string";
import * as React from "react";
import { Mutation } from "react-apollo";
import { useSelector, useDispatch } from "react-redux";
import useReactRouter from "use-react-router";

import {
  deselectFhirResource,
  updateFhirResource
} from "../../../../../../services/selectedNode/actions";

import ResourceSelect from "../../../../../../components/selects/resourceSelect";
import { IReduxStore } from "../../../../../../types";

const deleteResourceMutation = require("../../../../../../graphql/mutations/deleteResource.graphql");
const updateResource = require("../../../../../../graphql/mutations/updateResource.graphql");

interface IProps {
  data: any;
  loading: boolean;
  deleteResourceCallback: any;
}

const ResourceSelector = ({
  data,
  loading,
  deleteResourceCallback
}: IProps) => {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const { history, location } = useReactRouter();

  const updateLocationSearch = (key: string, value: string) => {
    const qs = QueryString.stringify({
      ...QueryString.parse(location.search),
      [key]: value
    });

    history.push({ search: qs });
  };

  const clearLocationSearch = (keys: string[]) => {
    let qs = { ...QueryString.parse(location.search) };
    keys.forEach(key => delete qs[key]);

    history.push({ search: QueryString.stringify(qs) });
  };

  return (
    <FormGroup>
      <ControlGroup>
        <ResourceSelect
          disabled={!selectedNode.source}
          icon={"layout-hierarchy"}
          inputItem={selectedNode.resource}
          intent={"primary"}
          items={data && data.availableResources ? data.availableResources : []}
          loading={loading}
          onChange={(resource: any) => {
            dispatch(
              updateFhirResource(resource.id, resource.fhirType, resource.label)
            );
            updateLocationSearch("resourceId", resource.id);
          }}
        />

        <Mutation mutation={updateResource}>
          {(updateResourceLabel: any, { data, loading }: any) => {
            const value = selectedNode.resource.label || "";
            return (
              <InputGroup
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const newValue = event.target.value;
                  dispatch(
                    updateFhirResource(
                      selectedNode.resource.id,
                      selectedNode.resource.fhirType,
                      newValue
                    )
                  );
                }}
                onKeyPress={(event: any) => {
                  if (event.key === "Enter") {
                    updateResourceLabel({
                      variables: {
                        where: {
                          id: selectedNode.resource.id
                        },
                        data: {
                          label: value
                        }
                      }
                    });
                  }
                }}
                type="text"
                placeholder="Label..."
                value={value}
                rightElement={
                  loading ? (
                    <Spinner size={15} />
                  ) : data ? (
                    <Icon icon="small-tick" intent="primary" />
                  ) : null
                }
              />
            );
          }}
        </Mutation>
        <Mutation
          mutation={deleteResourceMutation}
          onCompleted={(data: any) => {
            toaster.show({
              icon: "layout-hierarchy",
              intent: "success",
              message: `Ressource ${
                data.deleteResource.fhirType
              } supprimée pour ${selectedNode.source.name}.`,
              timeout: 4000
            });
            clearLocationSearch(["resourceId", "attributeId"]);
            dispatch(deselectFhirResource());
            deleteResourceCallback();
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
          {(deleteResource: any, { loading }: any) => (
            <Button
              disabled={selectedNode.resource.id === null}
              loading={loading}
              icon={"trash"}
              intent={"primary"}
              onClick={() => {
                deleteResource({
                  variables: {
                    resourceId: selectedNode.resource.id
                  }
                });
              }}
            />
          )}
        </Mutation>
      </ControlGroup>
    </FormGroup>
  );
};

export default ResourceSelector;
