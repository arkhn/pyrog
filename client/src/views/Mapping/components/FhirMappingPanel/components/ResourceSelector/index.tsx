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
import { useSelector, useDispatch } from "react-redux";
import useReactRouter from "use-react-router";

import { updateFhirResource } from "../../../../../../services/selectedNode/actions";

import ResourceSelect from "../../../../../../components/selects/resourceSelect";
import { IReduxStore } from "../../../../../../types";

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

  const updateLocationSearch = (key: string, value: string) => {
    const qs = QueryString.stringify({
      ...QueryString.parse(location.search),
      [key]: value
    });

    history.push({ search: qs });
  };

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
              updateLocationSearch("resourceId", resource.id);
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
