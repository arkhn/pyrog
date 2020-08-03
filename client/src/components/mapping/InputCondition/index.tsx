import React from 'react';
import { Button, Tag } from '@blueprintjs/core';
import { useMutation } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import { loader } from 'graphql.macro';

import { onError as onApolloError } from 'services/apollo';
import { Condition, IReduxStore, ISourceSchema } from 'types';

import ColumnSelect from 'components/selects/columnSelect';
import StringSelect from 'components/selects/stringSelect';

// GRAPHQL
const qInputsForAttribute = loader(
  'src/graphql/queries/inputsForAttribute.graphql'
);
const mUpdateCondition = loader(
  'src/graphql/mutations/updateCondition.graphql'
);
const mDeleteCondition = loader(
  'src/graphql/mutations/deleteCondition.graphql'
);

interface Props {
  condition: Condition;
}

const InputCondition = ({ condition }: Props) => {
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const schema = useSelector(
    (state: IReduxStore) => state.selectedNode.source.credential.schema
  );
  const path = useSelector(
    (state: IReduxStore) => state.selectedNode.attribute.path
  );
  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );
  const attributeId = attributesForResource[path].id;

  const onError = onApolloError(toaster);

  const [deleteCondition, { loading: loadDelete }] = useMutation(
    mDeleteCondition,
    {
      onError
    }
  );
  const [updateCondition] = useMutation(mUpdateCondition, {
    onError
  });

  const [action, setAction] = React.useState(condition.action);
  const [value, setValue] = React.useState(condition.value);

  const availableActions = ['INCLUDE', 'EXCLUDE'];

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
    <div className="input-conditions">
      <Button
        icon={'trash'}
        loading={loadDelete}
        minimal={true}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onClickDelete(condition);
        }}
      />
      <div
        className="stacked-tags"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <Tag minimal={true}>ACTION</Tag>
        <Tag intent={'primary'} large={true}>
          <StringSelect
            inputItem={action}
            items={availableActions}
            onChange={(action: string): void => {
              setAction(action);
              updateCondition({
                variables: {
                  conditionId: condition.id,
                  action
                }
              });
            }}
          />
        </Tag>
      </div>
      <Tag minimal={true}>IF</Tag>
      <div
        className="stacked-tags"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <Tag minimal={true}>COLUMN</Tag>
        <Tag intent={'primary'} large={true}>
          <ColumnSelect
            initialTable={condition.column.table}
            initialColumn={condition.column.column}
            tableChangeCallback={(e: string) => {
              updateCondition({
                variables: {
                  conditionId: condition.id,
                  table: e,
                  column: null
                }
              });
            }}
            columnChangeCallback={(e: string) => {
              updateCondition({
                variables: {
                  conditionId: condition.id,
                  column: e
                }
              });
            }}
            sourceSchema={schema as ISourceSchema}
          />
        </Tag>
      </div>
      <Tag minimal={true}>EQUALS</Tag>
      <div
        className="stacked-tags"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <Tag minimal={true}>VALUE</Tag>
        <Tag intent={'primary'} large={true}>
          <input
            className="text-input"
            value={value}
            type="text"
            placeholder="value..."
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
              // NOTE value updated in DB at each character. Put a submit button?
              setValue(e.target.value);
              updateCondition({
                variables: {
                  conditionId: condition.id,
                  value: e.target.value
                }
              });
            }}
          />
        </Tag>
      </div>
    </div>
  );
};

export default InputCondition;
