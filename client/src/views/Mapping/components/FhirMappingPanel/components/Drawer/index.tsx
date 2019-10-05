import {
  InputGroup,
  FormGroup,
  Button,
  Spinner,
  Classes,
  Icon,
  Drawer as BPDrawer,
  ControlGroup
} from "@blueprintjs/core";
import * as QueryString from "query-string";
import * as React from "react";
import { Mutation } from "react-apollo";
import { useSelector, useDispatch } from "react-redux";
import useReactRouter from "use-react-router";

import { IReduxStore } from "src/types";

import {
  updateFhirResource,
  deselectFhirResource
} from "src/services/selectedNode/actions";
const deleteResourceMutation = require("src/graphql/mutations/deleteResource.graphql");
const updateResource = require("src/graphql/mutations/updateResource.graphql");

interface IProps {
  title: string;
  isOpen: boolean;
  deleteResourceCallback: any;
  onCloseCallback: any;
}

const Drawer = ({
  title,
  isOpen,
  deleteResourceCallback,
  onCloseCallback
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
    <BPDrawer
      title={title}
      icon="properties"
      isOpen={isOpen}
      onClose={onCloseCallback}
      size={BPDrawer.SIZE_SMALL}
    >
      <div className={Classes.DRAWER_BODY}>
        <div className={Classes.DIALOG_BODY}>
          <FormGroup label="Resource Label">
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
          </FormGroup>
        </div>
      </div>
      <div className={Classes.DRAWER_FOOTER}>
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
            <ControlGroup fill={true}>
              <Button
                disabled={selectedNode.resource.id === null}
                loading={loading}
                icon={"trash"}
                intent={"danger"}
                onClick={() => {
                  deleteResource({
                    variables: {
                      resourceId: selectedNode.resource.id
                    }
                  });
                }}
                text="Delete Resource"
              />
            </ControlGroup>
          )}
        </Mutation>
      </div>
    </BPDrawer>
  );
};

export default Drawer;
