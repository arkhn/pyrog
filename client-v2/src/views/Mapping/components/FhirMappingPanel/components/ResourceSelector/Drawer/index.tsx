import { useApolloClient, useMutation } from "@apollo/react-hooks";
import {
  InputGroup,
  FormGroup,
  Button,
  Classes,
  Drawer as BPDrawer,
  ControlGroup,
  Position
} from "@blueprintjs/core";
import React from "react";
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

// GRAPHQL
const qResourcesForSource = require("src/graphql/queries/ResourcesForSource.graphql");
const resourceInfo = require("src/graphql/queries/resourceInfo.graphql");
const mDeleteResource = require("src/graphql/mutations/deleteResource.graphql");
const mUpdateResource = require("src/graphql/mutations/updateResource.graphql");

interface IProps {
  title: string;
  isOpen: boolean;
  deleteResourceCallback?: () => void;
  onCloseCallback?: () => void;
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

  const onFormSubmit = (updateResource: any) => {
    return (e: React.FormEvent<HTMLElement>) => {
      e.preventDefault();

      updateResource({
        variables: {
          resourceId: selectedNode.resource.id,
          data: {
            label,
            // primaryKeyOwner: pkOwner,
            // primaryKeyTable: pkTable,
            // primaryKeyColumn: pkColumn
          }
        }
      });
    };
  };

  const onUpdateCompleted = () => {
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
  };

  const onUpdateError = (error: any) => {
    toaster.show({
      message: "An error occurred while updating properties",
      intent: "danger",
      icon: "properties"
    });
  };

  const onDeletionCompleted = (data: any) => {
    toaster.show({
      icon: "layout-hierarchy",
      intent: "success",
      message: `Ressource ${data.deleteResource.fhirType} deleted for ${
        selectedNode.source.name
        }.`,
      timeout: 4000
    });
    deleteLocationParams(history, location, ["resourceId", "attributeId"]);
    dispatch(deselectFhirResource());
    deleteResourceCallback();
  };

  const onDeletionError = (error: any) => {
    toaster.show({
      icon: "error",
      intent: "danger",
      message: error.message,
      timeout: 4000
    });
    deleteResourceCallback();
  };

  // Mutation and query hooks
  const [
    updateResource,
    { loading: updatingResource }
  ] = useMutation(
    mUpdateResource,
    {
      onCompleted: onUpdateCompleted,
      onError: onUpdateError,
    }
  );

  const removeResourceFromCache = (cache: any, { data: { deleteResource } }: any) => {
    try {
      const { source } = cache.readQuery({
        query: qResourcesForSource,
        variables: {
          sourceId: selectedNode.source.id,
        }
      });
      const newSource = {
        ...source,
        resources:
          source.resources.filter((r: any) => r.id !== deleteResource.id),
      }
      cache.writeQuery({
        query: qResourcesForSource,
        variables: {
          sourceId: selectedNode.source.id,
        },
        data: { source: newSource }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const [
    deleteResource,
    { loading: deletingResource }
  ] = useMutation(
    mDeleteResource,
    {
      update: removeResourceFromCache,
      onCompleted: onDeletionCompleted,
      onError: onDeletionError
    }
  );

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
          setLabel(response.data.resource.label || "");
          setPkOwner(response.data.resource.primaryKeyOwner || "");
          setPkTable(response.data.resource.primaryKeyTable || "");
          setPkColumn(response.data.resource.primaryKeyColumn || "");
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
          <form onSubmit={onFormSubmit(updateResource)}>
            <FormGroup
              label="Resource Label"
              className="resource-info"
              disabled={updatingResource || selectedNode.resource.id === null}
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
              disabled={updatingResource || selectedNode.resource.id === null}
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
                disabled={updatingResource || selectedNode.resource.id === null}
              />
            </FormGroup>
            <Button
              disabled={updatingResource || selectedNode.resource.id === null}
              intent="primary"
              text="Save"
              type="submit"
            />
          </form>
        </div>
      </div>
      <div className={Classes.DRAWER_FOOTER}>
        <ControlGroup fill={true}>
          <Button
            disabled={selectedNode.resource.id === null}
            loading={deletingResource}
            icon={"trash"}
            intent={"danger"}
            onClick={() => {
              deleteResource({
                variables: {
                  id: selectedNode.resource.id
                }
              });
            }}
            text="Delete Resource"
          />
        </ControlGroup>
      </div>
    </BPDrawer>
  );
};

export default Drawer;
