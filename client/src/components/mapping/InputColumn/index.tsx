import {
  Breadcrumbs,
  Button,
  Card,
  Elevation,
  IBreadcrumbProps,
  Icon,
  Tag
} from '@blueprintjs/core';
import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';

import { onError as onApolloError } from 'services/apollo';
import { IReduxStore } from 'types';

// COMPONENTS
import Join from '../Join';
import { loader } from 'graphql.macro';
import { setAttributeInMap } from 'services/resourceInputs/actions';

// GRAPHQL
const qInputsForAttribute = loader(
  'src/graphql/queries/inputsForAttribute.graphql'
);
const mDeleteInput = loader('src/graphql/mutations/deleteInput.graphql');

interface Props {
  input: any;
}

const InputColumn = ({ input }: Props) => {
  const dispatch = useDispatch();

  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const onError = onApolloError(toaster);
  const { attribute } = useSelector((state: IReduxStore) => state.selectedNode);
  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );
  const attributeId = attributesForResource[attribute.path].id;

  const [deleteInput, { loading: loadDelInput }] = useMutation(mDeleteInput, {
    onError
  });

  const removeInputFromCache = (cache: any) => {
    const { attribute: dataAttribute } = cache.readQuery({
      query: qInputsForAttribute,
      variables: {
        attributeId: attributeId
      }
    });
    const newDataAttribute = {
      ...dataAttribute,
      inputGroups: dataAttribute.inputGroups
        .map((group: any) => ({
          ...group,
          inputs: group.inputs.filter((i: any) => i.id !== input.id)
        }))
        .filter((group: any) => group.inputs.length > 0)
    };
    dispatch(setAttributeInMap(attribute.path, newDataAttribute));
    cache.writeQuery({
      query: qInputsForAttribute,
      variables: {
        attributeId: attributeId
      },
      data: { attribute: newDataAttribute }
    });
  };

  const onClickDelete = async (e: React.MouseEvent) => {
    // Mutation to remove from DB
    e.stopPropagation();
    await deleteInput({
      variables: {
        inputId: input.id
      },
      update: removeInputFromCache
    });
  };

  return (
    <div className="input-card">
      <Button
        icon={'trash'}
        loading={loadDelInput}
        minimal={true}
        onClick={onClickDelete}
      />
      <Card elevation={Elevation.ZERO} className="input-column-info">
        {input.staticValue ? (
          <div className="input-column-name">
            <Tag large={true}>Static</Tag>
            <Tag intent={'success'} large={true} minimal={true}>
              {input.staticValue}
            </Tag>
          </div>
        ) : (
          <div>
            <div className="input-column-name">
              <Breadcrumbs
                breadcrumbRenderer={(item: IBreadcrumbProps) => {
                  return <div>{item.text}</div>;
                }}
                items={[
                  {
                    text: (
                      <div className="stacked-tags">
                        <Tag minimal={true}>TABLE</Tag>
                        <Tag intent={'success'} large={true}>
                          {input.sqlValue.table}
                        </Tag>
                      </div>
                    )
                  },
                  {
                    text: (
                      <div className="stacked-tags">
                        <Tag minimal={true}>COLUMN</Tag>
                        <Tag intent={'success'} large={true}>
                          {input.sqlValue.column}
                        </Tag>
                      </div>
                    )
                  }
                ]}
              />
            </div>
            {input.script && (
              <div className="input-script">
                <div className="stacked-tags">
                  <Tag minimal={true}>SCRIPT</Tag>
                  <Tag large={true}>{input.script}</Tag>
                </div>
              </div>
            )}
            {input.conceptMapId && (
              <div className="input-script">
                <div className="stacked-tags">
                  <Tag>CONCEPT MAP</Tag>
                  <Tag large={true}>{input.conceptMapId}</Tag>
                </div>
              </div>
            )}
            {input.sqlValue.joins.length > 0 && (
              <div className="input-column-joins">
                <Icon icon="left-join" />
                {input.sqlValue.joins.map((join: any, index: number) => (
                  <Join key={index} joinData={join} />
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default InputColumn;
