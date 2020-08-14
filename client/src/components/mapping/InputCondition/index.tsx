import React, { useEffect } from 'react';
import { Button, Tag } from '@blueprintjs/core';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import { loader } from 'graphql.macro';

import { onError as onApolloError } from 'services/apollo';
import { IAttribute, Condition, IReduxStore, ISourceSchema } from 'types';

import ColumnSelect from 'components/selects/columnSelect';
import StringSelect from 'components/selects/stringSelect';
import ConditionSelect from 'components/selects/conditionSelect';

// GRAPHQL
const qInputsForAttribute = loader(
  'src/graphql/queries/inputsForAttribute.graphql'
);
const qConditionsForResource = loader(
  'src/graphql/queries/conditionsForResource.graphql'
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

const availableActions = ['INCLUDE', 'EXCLUDE'];
const conditionRelations = ['EQ', 'LT', 'LE', 'GE', 'GT', 'NULL', 'NOTNULL'];
const conditionToString = new Map([
  ['EQ', '=='],
  ['LT', '<'],
  ['LE', '<='],
  ['GE', '>='],
  ['GT', '>'],
  ['NULL', 'IS NULL'],
  ['NOTNULL', 'IS NOT NULL']
]);
const unaryRelations = ['NULL', 'NOTNULL'];

const conditionToName = (condition: Condition): string =>
  `${condition.action} ${condition.sqlValue.table} ${
    condition.sqlValue.column
  } ${conditionToString.get(condition.relation)} ${condition.value}`;

const InputCondition = ({ condition }: Props) => {
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const schema = useSelector(
    (state: IReduxStore) => state.selectedNode.source.credential.schema
  );
  const resource = useSelector(
    (state: IReduxStore) => state.selectedNode.resource
  );
  const path = useSelector(
    (state: IReduxStore) => state.selectedNode.attribute.path
  );
  const attributesMap = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );
  const attributeId = attributesMap[path].id;

  const onError = onApolloError(toaster);

  const respQuery = useQuery(qConditionsForResource, {
    variables: {
      resourceId: resource.id
    },
    fetchPolicy: 'cache-first'
  });
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
  const [table, setTable] = React.useState(condition.sqlValue.table);
  const [column, setColumn] = React.useState(condition.sqlValue.column);
  const [relation, setRelation] = React.useState(condition.relation);
  const [value, setValue] = React.useState(condition.value || '');

  useEffect(() => {});
  const ResourceAttributes: IAttribute[] =
    respQuery.data?.resource.attributes || [];
  const allConditions: Condition[] = ResourceAttributes.reduce(
    (acc: Condition[], attribute) => [
      ...acc,
      ...attribute.inputGroups.reduce(
        (acc, inputGroup) => [...acc, ...inputGroup.conditions],
        []
      )
    ],
    []
  ).filter(
    condition =>
      condition.action &&
      condition.sqlValue.table &&
      condition.sqlValue.column &&
      condition.value
  );
  // Remove duplicates
  const resourceConditions: Condition[] = allConditions.filter(
    (condition, index) =>
      allConditions.map(conditionToName).indexOf(conditionToName(condition)) ===
      index
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
            initialTable={table}
            initialColumn={column}
            tableChangeCallback={(e: string) => {
              setTable(e);
              updateCondition({
                variables: {
                  conditionId: condition.id,
                  table: e,
                  column: null
                }
              });
            }}
            columnChangeCallback={(e: string) => {
              setColumn(e);
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
      <div
        className="stacked-tags"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <Tag minimal={true}>RELATION</Tag>
        <Tag intent={'primary'} large={true}>
          <StringSelect
            inputItem={relation}
            items={conditionRelations}
            displayItem={item => conditionToString.get(item)!}
            onChange={(relation: string): void => {
              setRelation(relation);
              updateCondition({
                variables: {
                  conditionId: condition.id,
                  relation
                }
              });
            }}
          />
        </Tag>
      </div>
      {!unaryRelations.includes(condition.relation) && (
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
      )}
      <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <ConditionSelect
          inputItem={{
            id: condition.id,
            action,
            sqlValue: {
              table,
              column
            },
            relation,
            value
          }}
          items={resourceConditions}
          itemToKey={conditionToName}
          onChange={(c: Condition): void => {
            setAction(c.action);
            setTable(c.sqlValue.table);
            setColumn(c.sqlValue.column);
            setRelation(c.relation);
            setValue(c.value);
            updateCondition({
              variables: {
                conditionId: condition.id,
                action: c.action,
                table: c.sqlValue.table,
                column: c.sqlValue.column,
                relation: c.relation,
                value: c.value
              }
            });
          }}
        />
      </div>
    </div>
  );
};

export default InputCondition;
