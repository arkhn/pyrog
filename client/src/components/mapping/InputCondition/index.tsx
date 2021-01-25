import React, { useState } from 'react';
import { Button, ButtonGroup, Card, Elevation } from '@blueprintjs/core';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { useSelector } from 'react-redux';
import { loader } from 'graphql.macro';
import { onError } from 'services/apollo';

import { Condition, IReduxStore, Join, Column } from 'types';
import ColumnSelect from 'components/selects/columnSelect';
import StringSelect from 'components/selects/stringSelect';
import ConditionSelect from 'components/selects/conditionSelect';
import { getDatabaseOwners } from 'services/selectedNode/selectors';
import { useSnackbar } from 'notistack';

// GRAPHQL
const mUpdateCondition = loader(
  'src/graphql/mutations/updateCondition.graphql'
);
const mUpdateJoin = loader('src/graphql/mutations/updateJoin.graphql');
const mAddJoin = loader('src/graphql/mutations/addJoinToColumn.graphql');
const mDeleteJoin = loader('src/graphql/mutations/deleteJoin.graphql');
const mDeleteCondition = loader(
  'src/graphql/mutations/deleteCondition.graphql'
);
const qConditionsForResource = loader(
  'src/graphql/queries/conditionsForResource.graphql'
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

const conditionToName = (condition: Condition): string =>
  `${condition.action} ${condition.sqlValue.table} ${
    condition.sqlValue.column
  } ${conditionsMap.get(condition.relation)} ${condition.value}`;

const InputCondition = ({ condition }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const availableOwners = useSelector(getDatabaseOwners);
  const { resource } = useSelector((state: IReduxStore) => state.selectedNode);

  const [conditionValue, setConditionValue] = useState(condition.value);

  const [updateCondition] = useMutation(mUpdateCondition, {
    onError: onError(enqueueSnackbar)
  });
  const [updateJoin] = useMutation(mUpdateJoin, {
    onError: onError(enqueueSnackbar)
  });
  const [addJoin] = useMutation(mAddJoin, {
    onError: onError(enqueueSnackbar)
  });
  const [deleteJoin] = useMutation(mDeleteJoin, {
    onError: onError(enqueueSnackbar)
  });
  const [deleteCondition, { loading: loadDelete }] = useMutation(
    mDeleteCondition,
    {
      onError: onError(enqueueSnackbar)
    }
  );

  const { data: conditionsData } = useQuery(qConditionsForResource, {
    variables: {
      resourceId: resource.id
    }
  });
  const allConditions: Condition[] = (
    conditionsData?.conditionsForResource || []
  ).filter(
    (c: Condition) =>
      c.action && c.sqlValue.table && c.sqlValue.column && c.relation
  );
  // Remove duplicates
  const resourceConditions: Condition[] = allConditions.filter(
    (cond, index) =>
      allConditions.map(conditionToName).indexOf(conditionToName(cond)) ===
      index
  );

  const onClickDelete = (cond: Condition) =>
    deleteCondition({
      variables: {
        inputGroupId: cond.inputGroupId,
        conditionId: cond.id
      }
    });

  return (
    <div className="input-condition">
      <div className="input-card">
        <Card elevation={Elevation.ONE}>
          <div className="card-absolute">
            <div className="card-flex">
              <div className="card-tag-condition">Condition</div>
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
                initialOwner={condition.sqlValue.owner}
                initialTable={condition.sqlValue.table}
                initialColumn={condition.sqlValue.column}
                initialJoins={condition.sqlValue.joins}
                columnChangeCallback={({ owner, table, column }: Column) =>
                  updateCondition({
                    variables: {
                      conditionId: condition.id,
                      column: {
                        owner: { id: owner!.id },
                        table,
                        column
                      }
                    }
                  })
                }
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
                sourceOwners={availableOwners}
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
                <input
                  className="text-input"
                  value={conditionValue || ''}
                  type="text"
                  placeholder="value..."
                  onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
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
            )}
            <div className="conditions-form-condition-select">
              <ConditionSelect
                items={resourceConditions}
                itemToKey={conditionToName}
                onChange={(c: Condition): void => {
                  updateCondition({
                    variables: {
                      conditionId: condition.id,
                      action: c.action,
                      column: {
                        ...c.sqlValue,
                        owner: { id: c.sqlValue.owner!.id }
                      },
                      relation: c.relation,
                      value: c.value
                    }
                  });
                }}
              />
            </div>
          </div>
        </Card>
        <ButtonGroup vertical={true}>
          <Button
            icon={'cross'}
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
