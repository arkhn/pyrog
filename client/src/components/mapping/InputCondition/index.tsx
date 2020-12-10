import React from 'react';
import {
  Breadcrumbs,
  Button,
  Card,
  Elevation,
  IBreadcrumbProps,
  Tag
} from '@blueprintjs/core';
import { useMutation } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import { loader } from 'graphql.macro';

import { onError as onApolloError } from 'services/apollo';
import { Condition, IReduxStore } from 'types';

// GRAPHQL
const qInputsForAttribute = loader(
  'src/graphql/queries/inputsForAttribute.graphql'
);
const mDeleteCondition = loader(
  'src/graphql/mutations/deleteCondition.graphql'
);

interface Props {
  condition: Condition;
}

const unaryRelations = ['NULL', 'NOTNULL'];

const InputCondition = ({ condition }: Props) => {
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const path = useSelector(
    (state: IReduxStore) => state.selectedNode.attribute.path
  );
  const attributesMap = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );
  const attributeId = attributesMap[path].id;

  const onError = onApolloError(toaster);

  const [deleteCondition, { loading: loadDelete }] = useMutation(
    mDeleteCondition,
    {
      onError
    }
  );

  const removeConditionFromCache = (conditionId: string) => (cache: any) => {
    const { attribute: dataAttribute } = cache.readQuery({
      query: qInputsForAttribute,
      variables: {
        attributeId: attributeId
      }
    });
    const newDataAttribute = {
      ...dataAttribute,
      inputGroups: dataAttribute.inputGroups.map((group: any) => ({
        ...group,
        conditions: group.conditions.filter(
          (c: Condition) => c.id !== conditionId
        )
      }))
    };
    cache.writeQuery({
      query: qInputsForAttribute,
      variables: {
        attributeId: attributeId
      },
      data: { attribute: newDataAttribute }
    });
  };

  const onClickDelete = async (condition: Condition) =>
    await deleteCondition({
      variables: {
        conditionId: condition.id
      },
      update: removeConditionFromCache(condition.id)
    });

  return (
    <div className="input-card">
      <Button
        icon={'trash'}
        loading={loadDelete}
        minimal={true}
        onClick={() => {
          onClickDelete(condition);
        }}
      />
      <Card elevation={Elevation.ZERO} className="input-column-info">
        <div className="input-column-name">
          <div className="stacked-tags">
            <Tag minimal={true}>ACTION</Tag>
            <Tag intent={'primary'} large={true}>
              {condition.action}
            </Tag>
          </div>
          <Tag minimal={true}>IF</Tag>
          <div className="stacked-tags">
            <Breadcrumbs
              breadcrumbRenderer={(item: IBreadcrumbProps) => (
                <div>{item.text}</div>
              )}
              items={[
                {
                  text: (
                    <div className="stacked-tags">
                      <Tag minimal={true}>TABLE</Tag>
                      <Tag intent={'primary'} large={true}>
                        {condition.sqlValue.table}
                      </Tag>
                    </div>
                  )
                },
                {
                  text: (
                    <div className="stacked-tags">
                      <Tag minimal={true}>COLUMN</Tag>
                      <Tag intent={'primary'} large={true}>
                        {condition.sqlValue.column}
                      </Tag>
                    </div>
                  )
                }
              ]}
            />
          </div>
          <div className="stacked-tags">
            <Tag minimal={true}>RELATION</Tag>
            <Tag intent={'primary'} large={true}>
              {condition.relation}
            </Tag>
          </div>
          {!unaryRelations.includes(condition.relation) && (
            <div className="stacked-tags">
              <Tag minimal={true}>VALUE</Tag>
              <Tag intent={'primary'} large={true}>
                {condition.value}
              </Tag>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default InputCondition;
