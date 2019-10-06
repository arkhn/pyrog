import {
  InputGroup,
  FormGroup,
  Button,
  Classes,
  Drawer as BPDrawer,
  ControlGroup,
  Position
} from "@blueprintjs/core";
import * as React from "react";
import { Mutation } from "react-apollo";
import { useApolloClient } from "react-apollo-hooks";
import { useSelector, useDispatch, useStore } from "react-redux";
import useReactRouter from "use-react-router";

import { IReduxStore } from "src/types";

import ColumnPicker from "src/views/Mapping/components/ColumnPicker";

import "./style.less";

import {
  updateFhirResource,
  deselectFhirResource
} from "src/services/selectedNode/actions";

import { deleteLocationParams } from "src/services/urlState";

const resourceInfo = require("src/graphql/queries/resourceInfo.graphql");
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
  const client = useApolloClient();
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const store = useStore();
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const { history, location } = useReactRouter();

  const [schema, setSchema] = React.useState({});
  const [label, setLabel] = React.useState("");
  const [pkOwner, setPkOwner] = React.useState("");
  const [pkTable, setPkTable] = React.useState("");
  const [pkColumn, setPkColumn] = React.useState("");

  React.useEffect(() => {
    if (selectedNode.resource.id) {
      client
        .query({
          query: resourceInfo,
          variables: {
            resourceId: selectedNode.resource.id
          }
        })
        .then((response: any) => {
          setLabel(response.data.resourceInfo.label);
          setPkOwner(response.data.resourceInfo.primaryKeyOwner || "");
          setPkTable(response.data.resourceInfo.primaryKeyTable || "");
          setPkColumn(response.data.resourceInfo.primaryKeyColumn || "");
        });
    }

    if (selectedNode.source.name) {
      setSchema(
        store.getState().data.sourceSchemas.schemaBySourceName[
          selectedNode.source.name
        ]
      );
    }
  }, [client, selectedNode, store]);

  return (
    <BPDrawer
      title={title}
      icon={title ? "properties" : null}
      isOpen={isOpen}
      onClose={onCloseCallback}
      size={BPDrawer.SIZE_SMALL}
    >
      <div className={Classes.DRAWER_BODY}>
        <div className={Classes.DIALOG_BODY}>
          <Mutation
            mutation={updateResource}
            onCompleted={() => {
              toaster.show({
                message: `Successfully updated ${
                  selectedNode.resource.fhirType
                } properties`,
                intent: "success",
                icon: "properties"
              });

              dispatch(
                updateFhirResource(
                  selectedNode.resource.id,
                  selectedNode.resource.fhirType,
                  label
                )
              );
            }}
            onError={(error: any) => {
              console.log(error);
              toaster.show({
                message: "An error occurred while updating properties",
                intent: "danger",
                icon: "properties"
              });
            }}
          >
            {(updateResource: any, { loading }: any) => {
              return (
                <form
                  onSubmit={(e: React.FormEvent<HTMLElement>) => {
                    e.preventDefault();

                    updateResource({
                      variables: {
                        where: {
                          id: selectedNode.resource.id
                        },
                        data: {
                          label,
                          primaryKeyOwner: pkOwner,
                          primaryKeyTable: pkTable,
                          primaryKeyColumn: pkColumn
                        }
                      }
                    });
                  }}
                >
                  <FormGroup
                    label="Resource Label"
                    className="resource-info"
                    disabled={loading || selectedNode.resource.id === null}
                  >
                    <InputGroup
                      type="text"
                      placeholder="Label..."
                      value={label}
                      onChange={(event: React.FormEvent<HTMLElement>) => {
                        setLabel((event.target as any).value);
                      }}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Primary Key"
                    disabled={loading || selectedNode.resource.id === null}
                  >
                    <ColumnPicker
                      ownerChangeCallback={(owner: string) => {
                        setPkOwner(owner);
                        setPkTable("");
                        setPkColumn("");
                      }}
                      tableChangeCallback={(table: string) => {
                        setPkTable(table);
                        setPkColumn("");
                      }}
                      columnChangeCallback={(column: string) => {
                        setPkColumn(column);
                      }}
                      initialColumn={{
                        owner: pkOwner,
                        table: pkTable,
                        column: pkColumn
                      }}
                      sourceSchema={schema}
                      vertical={true}
                      fill={true}
                      popoverProps={{
                        autoFocus: true,
                        boundary: "viewport",
                        canEscapeKeyClose: true,
                        lazy: true,
                        position: Position.LEFT_TOP,
                        usePortal: true
                      }}
                      disabled={loading || selectedNode.resource.id === null}
                    />
                  </FormGroup>
                  <Button
                    disabled={loading || selectedNode.resource.id === null}
                    intent="primary"
                    text="Save"
                    type="submit"
                  />
                </form>
              );
            }}
          </Mutation>
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
            deleteLocationParams(history, location, [
              "resourceId",
              "attributeId"
            ]);
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
