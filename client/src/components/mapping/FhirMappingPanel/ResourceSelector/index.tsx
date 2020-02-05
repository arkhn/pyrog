import { FormGroup, ControlGroup, Button } from '@blueprintjs/core';
import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';

import { loader } from 'graphql.macro';

import { updateFhirResource } from 'services/selectedNode/actions';
import { initAttributesMap } from 'services/resourceInputs/actions';
import { IReduxStore } from 'types';

import Drawer from './Drawer';
import ResourceSelect from 'components/selects/resourceSelect';

interface Resource {
  id: string;
  label: string;
  primaryKeyOwner: string;
  primaryKeyTable: string;
  primaryKeyColumn: string;
  definition: {
    id: string;
    type: string;
  };
}

interface Props {
  resources: Resource[];
  loading: boolean;
  deleteResourceCallback: any;
}

const qResourceAttributes = loader(
  'src/graphql/queries/resourceAttributes.graphql'
);

const ResourceSelector = ({
  resources,
  loading,
  deleteResourceCallback
}: Props) => {
  const client = useApolloClient();
  const dispatch = useDispatch();
  const { source, resource } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );
  const [drawerIsOpen, setDrawerIsOpen] = React.useState(false);

  const onClickedResource = async (clickedResource: any) => {
    // Query attributes for corresponding resource
    const {
      data: {
        resource: { attributes }
      }
    } = await client.query({
      query: qResourceAttributes,
      variables: { resourceId: clickedResource.id }
    });

    // Update Redux store
    dispatch(initAttributesMap(attributes));
    dispatch(updateFhirResource(clickedResource));
  };

  return (
    <>
      <FormGroup>
        <ControlGroup>
          <ResourceSelect
            disabled={!source}
            icon={'layout-hierarchy'}
            inputItem={
              !resource
                ? ({} as Resource)
                : resources.find(r => r.id === resource.id) || ({} as Resource)
            }
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
          resource={resource}
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
