import { FormGroup, ControlGroup, Button } from '@blueprintjs/core';
import React from 'react';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import useReactRouter from 'use-react-router';

import { loader } from 'graphql.macro';

import { updateLocationParams } from 'services/urlState';
import { updateFhirResource } from 'services/selectedNode/actions';
// import { updateStructure } from 'services/structure/actions';
import { IReduxStore } from 'types';

import Drawer from './Drawer';
import ResourceSelect from 'components/selects/resourceSelect';

interface IProps {
  resources: any;
  loading: boolean;
  setBaseDefinitionId: any;
  deleteResourceCallback: any;
}

const qStructureDisplay = loader(
  'src/graphql/queries/structureDisplay.graphql'
);

const ResourceSelector = ({
  resources,
  loading,
  setBaseDefinitionId,
  deleteResourceCallback
}: IProps) => {
  const client = useApolloClient();
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const { history, location } = useReactRouter();
  const [drawerIsOpen, setDrawerIsOpen] = React.useState(false);
  const { source, resource } = selectedNode;

  const onClickedResource = async (resource: any) => {
    dispatch(
      updateFhirResource(resource.id, resource.label, resource.definition)
    );
    updateLocationParams(history, location, 'resourceId', resource.id);
    setBaseDefinitionId(resource.definition.id);
  };

  return (
    <>
      <FormGroup>
        <ControlGroup>
          <ResourceSelect
            disabled={!source}
            icon={'layout-hierarchy'}
            inputItem={resource}
            intent={'primary'}
            items={resources}
            loading={loading}
            onChange={onClickedResource}
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
          title={resource.definition.type}
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
