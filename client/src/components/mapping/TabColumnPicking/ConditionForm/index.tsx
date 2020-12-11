import React, { useEffect, useState } from 'react';
import { Button, Card, Elevation, Tag } from '@blueprintjs/core';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import { loader } from 'graphql.macro';

import { onError as onApolloError } from 'services/apollo';
import { IAttribute, Condition, IReduxStore, ISourceSchema, Join } from 'types';

import ColumnSelect from 'components/selects/columnSelect';
import StringSelect from 'components/selects/stringSelect';
import ConditionSelect from 'components/selects/conditionSelect';

// GRAPHQL
const qConditionsForResource = loader(
  'src/graphql/queries/conditionsForResource.graphql'
);
const mCreateCondition = loader(
  'src/graphql/mutations/addConditionToInputGroup.graphql'
);

const availableActions = ['INCLUDE', 'EXCLUDE'];
const conditionsMap = new Map([
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
  } ${conditionsMap.get(condition.relation)} ${condition.value}`;

const ConditionForm = () => {
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const schema = useSelector(
    (state: IReduxStore) => state.selectedNode.source.credential.schema
  );
  const { attribute, resource, selectedInputGroup } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );
  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );

  const onError = onApolloError(toaster);

  const path = attribute.path;
  // The id of the input group in which we want to put the new input.
  // If it is null, it means that we'll need to create a new input group first.
  let inputGroupId =
    selectedInputGroup === null ||
    !attributesForResource[path] ||
    selectedInputGroup >= attributesForResource[path].inputGroups.length
      ? null
      : attributesForResource[path].inputGroups[selectedInputGroup].id;

  const respQuery = useQuery(qConditionsForResource, {
    variables: {
      resourceId: resource.id
    },
    fetchPolicy: 'cache-first'
  });
  const [createCondition] = useMutation(mCreateCondition, {
    onError
  });

  const [conditionAction, setConditionAction] = useState('INCLUDE');
  const [conditionTable, setConditionTable] = useState('');
  const [conditionColumn, setConditionColumn] = useState('');
  const [conditionJoins, setConditionJoins] = useState([] as Join[]);
  const [conditionRelation, setConditionRelation] = useState('EQ');
  const [conditionValue, setConditionValue] = useState('');

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
      condition.relation
  );
  // Remove duplicates
  const resourceConditions: Condition[] = allConditions.filter(
    (condition, index) =>
      allConditions.map(conditionToName).indexOf(conditionToName(condition)) ===
      index
  );

  return (
    <Card elevation={Elevation.ONE}>
      <div className="card-absolute">
        <div className="card-flex">
          <div className="card-tag">Condition</div>
        </div>
      </div>

      <div className="conditions-form">
        <div className="conditions-form-action">
          <div className="stacked-tags">
            <Tag minimal={true}>ACTION</Tag>
            <StringSelect
              inputItem={conditionAction}
              items={availableActions}
              onChange={(action: string): void => {
                setConditionAction(action);
              }}
            />
          </div>
        </div>
        <div className="conditions-form-column">
          <div className="stacked-tags">
            <Tag minimal={true}>COLUMN</Tag>
            <ColumnSelect
              initialTable={conditionTable}
              initialColumn={conditionColumn}
              tableChangeCallback={(e: string) => {
                setConditionTable(e);
                setConditionColumn('');
              }}
              columnChangeCallback={(e: string) => {
                setConditionColumn(e);
              }}
              joinsChangeCallback={(joins: Join[]): void => {
                setConditionJoins(joins);
              }}
              sourceSchema={schema as ISourceSchema}
              primaryKeyTable={resource.primaryKeyTable}
            />
          </div>
        </div>
        <div className="conditions-form-value">
          <div className="conditions-form-relation">
            <div className="stacked-tags">
              <Tag minimal={true}>RELATION</Tag>
              <StringSelect
                inputItem={conditionRelation}
                items={Array.from(conditionsMap.keys())}
                displayItem={item => conditionsMap.get(item)!}
                onChange={(relation: string): void => {
                  setConditionRelation(relation);
                }}
              />
            </div>
          </div>
        </div>
        {!unaryRelations.includes(conditionRelation) && (
          <div className="conditions-form-value">
            <div className="stacked-tags">
              <Tag minimal={true}>VALUE</Tag>
              <input
                className="text-input"
                value={conditionValue}
                type="text"
                placeholder="value..."
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  setConditionValue(e.target.value);
                }}
              />
            </div>
          </div>
        )}
        <div className="conditions-form-condition-select">
          <ConditionSelect
            items={resourceConditions}
            itemToKey={conditionToName}
            onChange={(c: Condition): void => {
              setConditionAction(c.action);
              setConditionTable(c.sqlValue.table);
              setConditionColumn(c.sqlValue.column);
              setConditionRelation(c.relation);
              setConditionValue(c.value);
            }}
          />
        </div>
        <div className="conditions-form-add-button">
          <Button
            icon={'add'}
            onClick={() => {
              createCondition({
                variables: {
                  inputGroupId: inputGroupId,
                  action: conditionAction,
                  columnInput: {
                    table: conditionTable,
                    column: conditionColumn,
                    joins: conditionJoins
                  },
                  relation: conditionRelation,
                  value: conditionValue
                }
              });
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default ConditionForm;
