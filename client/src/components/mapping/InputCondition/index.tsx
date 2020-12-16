import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Card, Elevation, Tag } from '@blueprintjs/core';
import { useMutation } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import { loader } from 'graphql.macro';
import { onError as onApolloError } from 'services/apollo';

import { Condition, IReduxStore, ISourceSchema, Join } from 'types';
import ColumnSelect from 'components/selects/columnSelect';
import StringSelect from 'components/selects/stringSelect';
import ConditionSelect from 'components/selects/conditionSelect';

// GRAPHQL
const qInputsForAttribute = loader(
  'src/graphql/queries/inputsForAttribute.graphql'
);
const mUpdateCondition = loader(
  'src/graphql/mutations/updateCondition.graphql'
);
const mUpdateJoin = loader('src/graphql/mutations/updateJoin.graphql');
const mAddJoin = loader('src/graphql/mutations/addJoinToColumn.graphql');
const mDeleteJoin = loader('src/graphql/mutations/deleteJoin.graphql');
const mDeleteCondition = loader(
  'src/graphql/mutations/deleteCondition.graphql'
);

interface Props {
  condition: Condition;
}

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

const InputCondition = ({ condition }: Props) => {
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

  const path = attribute.path;
  const attributeId = attributesForResource[path].id;
  // The id of the input group in which we want to put the new input.
  // If it is null, it means that we'll need to create a new input group first.
  let inputGroupId =
    selectedInputGroup === null ||
    !attributesForResource[path] ||
    selectedInputGroup >= attributesForResource[path].inputGroups.length
      ? null
      : attributesForResource[path].inputGroups[selectedInputGroup].id;

  const onError = onApolloError(toaster);

  const [updateCondition] = useMutation(mUpdateCondition, {
    onError
  });
  const [updateJoin] = useMutation(mUpdateJoin, {
    onError
  });
  const [addJoin] = useMutation(mAddJoin, {
    onError
  });
  const [deleteJoin] = useMutation(mDeleteJoin, {
    onError
  });
  const [deleteCondition, { loading: loadDelete }] = useMutation(
    mDeleteCondition,
    {
      onError
    }
  );

  const [conditionValue, setConditionValue] = useState(condition.value || '');

  useEffect(() => {
    setConditionValue(condition.value);
  }, [condition.value]);

  // TODO can we avoid that?
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
    <div className="input-condition">
      <div className="input-card">
        <Card elevation={Elevation.ONE}>
          <div className="card-absolute">
            <div className="card-flex">
              <div className="card-tag">Condition</div>
            </div>
          </div>
          <div className="conditions-form">
            <div className="conditions-form-action">
              <StringSelect
                inputItem={condition.action}
                items={availableActions}
                onChange={(action: string): void => {
                  updateCondition({
                    variables: {
                      conditionId: condition.id,
                      action
                    }
                  });
                }}
              />
            </div>
            <div className="conditions-form-column">
              <ColumnSelect
                initialTable={condition.sqlValue.table}
                initialColumn={condition.sqlValue.column}
                initialJoins={condition.sqlValue.joins}
                tableChangeCallback={(table: string) => {
                  updateCondition({
                    variables: {
                      conditionId: condition.id,
                      table,
                      column: ''
                    }
                  });
                }}
                columnChangeCallback={(column: string) => {
                  updateCondition({
                    variables: {
                      conditionId: condition.id,
                      column
                    }
                  });
                }}
                joinChangeCallback={(joinId: string, newJoin: Join): void => {
                  updateJoin({
                    variables: {
                      joinId,
                      data: newJoin
                    }
                  });
                }}
                addJoinCallback={(newJoin: Join): void => {
                  addJoin({
                    variables: {
                      columnId: condition.sqlValue.id,
                      join: newJoin
                    }
                  });
                }}
                deleteJoinCallback={(joinId: string): void => {
                  deleteJoin({
                    variables: {
                      joinId
                    }
                  });
                }}
                sourceSchema={schema as ISourceSchema}
                primaryKeyTable={resource.primaryKeyTable}
              />
            </div>
            <div className="conditions-form-value">
              <div className="conditions-form-relation">
                <StringSelect
                  inputItem={condition.relation}
                  items={Array.from(conditionsMap.keys())}
                  displayItem={item => conditionsMap.get(item)!}
                  onChange={(relation: string): void => {
                    updateCondition({
                      variables: {
                        conditionId: condition.id,
                        relation
                      }
                    });
                  }}
                />
              </div>
            </div>
            {!unaryRelations.includes(condition.relation) && (
              <div className="conditions-form-value">
                <div className="stacked-tags">
                  <Tag minimal={true}>VALUE</Tag>
                  <input
                    className="text-input"
                    value={conditionValue}
                    type="text"
                    placeholder="value..."
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement>
                    ): void => {
                      setConditionValue(e.target.value);
                    }}
                    onBlur={(e: React.ChangeEvent<HTMLInputElement>): void => {
                      updateCondition({
                        variables: {
                          conditionId: condition.id,
                          value: e.target.value
                        }
                      });
                    }}
                  />
                </div>
              </div>
            )}
            <div className="conditions-form-condition-select">
              {/* <ConditionSelect
              items={resourceConditions}
              itemToKey={conditionToName}
              onChange={(c: Condition): void => {
                // setConditionAction(c.action);
                // setConditionTable(c.sqlValue.table);
                // setConditionColumn(c.sqlValue.column);
                // setConditionRelation(c.relation);
                // setConditionValue(c.value);
              }}
            /> */}
            </div>
          </div>
        </Card>
        <ButtonGroup vertical={true}>
          <Button
            icon={'trash'}
            loading={loadDelete}
            minimal={true}
            onClick={() => {
              onClickDelete(condition);
            }}
          />
        </ButtonGroup>
      </div>
    </div>
  );
};

export default InputCondition;
