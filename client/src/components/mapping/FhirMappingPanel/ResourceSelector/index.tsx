import { FormGroup, ControlGroup, Button } from '@blueprintjs/core';
import React from 'react';
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import useReactRouter from 'use-react-router';

import { loader } from 'graphql.macro';

import { updateLocationParams } from 'services/urlState';
import { updateFhirResource } from 'services/selectedNode/actions';
import { initAttributesMap } from 'services/resourceInputs/actions';
import { IReduxStore } from 'types';

import Drawer from './Drawer';
import ResourceSelect from 'components/selects/resourceSelect';

interface IProps {
  resources: any;
  loading: boolean;
  deleteResourceCallback: any;
}

const qResource = loader('src/graphql/queries/resource.graphql');

const ResourceSelector = ({
  resources,
  loading,
  deleteResourceCallback
}: IProps) => {
  const client = useApolloClient();
  const dispatch = useDispatch();
  const { source, resource } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );
  const { history, location } = useReactRouter();
  const [drawerIsOpen, setDrawerIsOpen] = React.useState(false);

  const onClickedResource = async (resource: any) => {
    // Query attributes for corresponding resource
    const { data } = await client.query({
      query: qResource,
      variables: { resourceId: resource.id }
    });

    // Update Redux store
    dispatch(initAttributesMap(data.resource.attributes));
    dispatch(
      updateFhirResource(resource.id, resource.label, resource.definition)
    );
    updateLocationParams(history, location, 'resourceId', resource.id);
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
