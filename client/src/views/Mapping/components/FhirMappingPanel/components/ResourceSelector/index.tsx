import { FormGroup, ControlGroup, Button } from "@blueprintjs/core";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import useReactRouter from "use-react-router";

import { updateLocationParams } from "src/services/urlState";
import { updateFhirResource } from "src/services/selectedNode/actions";
import { IReduxStore } from "src/types";

import ResourceSelect from "src/components/selects/resourceSelect";

import Drawer from "../Drawer";

interface IProps {
  availableResources: any;
  loading: boolean;
  deleteResourceCallback: any;
}

const ResourceSelector = ({
  availableResources,
  loading,
  deleteResourceCallback
}: IProps) => {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const { history, location } = useReactRouter();
  const [drawerIsOpen, setDrawerIsOpen] = React.useState(false);

  return (
    <>
      <FormGroup>
        <ControlGroup>
          <ResourceSelect
            disabled={!selectedNode.source}
            icon={"layout-hierarchy"}
            inputItem={selectedNode.resource}
            intent={"primary"}
            items={availableResources}
            loading={loading}
            onChange={(resource: any) => {
              dispatch(
                updateFhirResource(
                  resource.id,
                  resource.fhirType,
                  resource.label
                )
              );
              updateLocationParams(
                history,
                location,
                "resourceId",
                resource.id
              );
            }}
          />
        </ControlGroup>
        <Button
          icon="more"
          disabled={selectedNode.resource.id === null}
          minimal
          onClick={() => {
            setDrawerIsOpen(true);
          }}
        />
      </FormGroup>
      <Drawer
        title={selectedNode.resource.fhirType}
        isOpen={drawerIsOpen}
        deleteResourceCallback={deleteResourceCallback}
        onCloseCallback={() => {
          setDrawerIsOpen(false);
        }}
      />
    </>
  );
};

export default ResourceSelector;
