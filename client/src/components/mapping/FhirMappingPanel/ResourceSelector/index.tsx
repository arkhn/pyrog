import { FormGroup, ControlGroup, Button } from '@blueprintjs/core';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useReactRouter from 'use-react-router';

import { updateLocationParams } from 'services/urlState';
import { updateFhirResource } from 'services/selectedNode/actions';
import { IReduxStore } from 'types';

import Drawer from './Drawer';
import ResourceSelect from 'components/selects/resourceSelect';

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
  const { source, resource } = selectedNode;

  return (
    <>
      <FormGroup>
        <ControlGroup>
          <ResourceSelect
            disabled={!source}
            icon={'layout-hierarchy'}
            inputItem={resource}
            intent={'primary'}
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
                'resourceId',
                resource.id
              );
            }}
          />
        </ControlGroup>
        <Button
          icon="more"
          disabled={!resource}
          minimal
          onClick={() => {
            setDrawerIsOpen(true);
          }}
        />
      </FormGroup>
      {resource && (
        <Drawer
          title={resource.fhirType}
          isOpen={drawerIsOpen}
          deleteResourceCallback={deleteResourceCallback}
          onCloseCallback={() => {
            setDrawerIsOpen(false);
          }}
        />
      )}
    </>
  );
};

export default ResourceSelector;
