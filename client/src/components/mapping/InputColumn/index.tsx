import {
  Button,
  ButtonGroup,
  Card,
  Elevation,
  Position,
  Tag
} from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { loader } from 'graphql.macro';
import { useMutation } from '@apollo/react-hooks';

import { onError } from 'services/apollo';
import { ConceptMap, IInput, IReduxStore, Join, Column } from 'types';
import { FHIR_API_URL } from '../../../constants';

import ColumnSelect from 'components/selects/columnSelect';
import ConceptMapDialog from 'components/mapping/ConceptMap';
import ScriptSelect from 'components/selects/scriptSelect';
import { getDatabaseOwners } from 'services/selectedNode/selectors';
import { useSnackbar } from 'notistack';

// GRAPHQL
const mUpdateInput = loader('src/graphql/mutations/updateInput.graphql');
const mUpdateJoin = loader('src/graphql/mutations/updateJoin.graphql');
const mAddJoin = loader('src/graphql/mutations/addJoinToColumn.graphql');
const mDeleteJoin = loader('src/graphql/mutations/deleteJoin.graphql');
const mDeleteInput = loader('src/graphql/mutations/deleteInput.graphql');

interface Props {
  input: IInput;
}

const InputColumn = ({ input }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { attribute, resource, source } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );
  const availableOwners = useSelector(getDatabaseOwners);

  const [conceptMap, setConceptMap] = useState<ConceptMap | undefined>(
    undefined
  );
  const [isConceptMapOverlayVisible, setConceptMapOverlayVisible] = useState(
    false
  );

  const [updateInput] = useMutation(mUpdateInput, {
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
  const [deleteInput, { loading: loadDelInput }] = useMutation(mDeleteInput, {
    onError: onError(enqueueSnackbar)
  });

  const onClickDelete = () => {
    deleteInput({
      variables: {
        inputGroupId: input.inputGroupId,
        inputId: input.id
      }
    });
  };

  useEffect(() => {
    if (input.conceptMapId) {
      const fetchConceptMap = async (conceptMapId: string) => {
        const response = await axios.get(
          `${FHIR_API_URL}/ConceptMap/${conceptMapId}`
        );
        if (response.data.resourceType === 'OperationOutcome')
          throw new Error(response.data.issue[0].diagnostics);
        setConceptMap(response.data as ConceptMap);
      };
      fetchConceptMap(input.conceptMapId).catch(e => {
        console.error(e);
      });
    }
  }, [input.conceptMapId]);

  return (
    <div className="input-column">
      <div className="input-card">
        <Card elevation={Elevation.ONE}>
          <div className="card-absolute">
            <div className="card-flex">
              <div className="card-tag-dynamic">Dynamic</div>
              {!source.credential && (
                <div className="card-credentials-missing">
                  Database credentials missing
                </div>
              )}
            </div>
          </div>
          <div className="sql-input-form">
            <ColumnSelect
              columnChangeCallback={({ owner, table, column }: Column) =>
                updateInput({
                  variables: {
                    inputId: input.id,
                    data: { owner: { id: owner!.id }, table, column }
                  }
                })
              }
              joinChangeCallback={(joinId: string, newJoin: Join) =>
                updateJoin({
                  variables: {
                    joinId,
                    data: newJoin
                  }
                })
              }
              addJoinCallback={(newJoin: Join): void => {
                addJoin({
                  variables: {
                    columnId: input.sqlValue.id,
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
              initialOwner={input.sqlValue.owner}
              initialTable={input.sqlValue.table}
              initialColumn={input.sqlValue.column}
              initialJoins={input.sqlValue.joins}
              sourceOwners={availableOwners}
              primaryKeyTable={resource.primaryKeyTable}
              popoverProps={{
                autoFocus: true,
                boundary: 'viewport',
                canEscapeKeyClose: true,
                lazy: true,
                position: Position.TOP,
                usePortal: true
              }}
            />
            <div className="sql-input-form-script">
              <div className="stacked-tags">
                <Tag minimal={true}>SCRIPT</Tag>
                <ScriptSelect
                  selectedScript={input.script}
                  onChange={(script: string) => {
                    updateInput({
                      variables: {
                        inputId: input.id,
                        data: { script }
                      }
                    });
                  }}
                  onClear={(): void => {
                    updateInput({
                      variables: {
                        inputId: input.id,
                        data: { script: null }
                      }
                    });
                  }}
                />
              </div>
            </div>
            {['code', 'string'].includes(attribute.types[0]) && (
              <div className="stacked-tags">
                <Tag minimal={true}>CONCEPT MAP</Tag>
                <ButtonGroup>
                  <Button
                    text={conceptMap?.title || 'None'}
                    onClick={(_e: React.MouseEvent) => {
                      setConceptMapOverlayVisible(true);
                    }}
                  />
                  <Button
                    className="delete-button"
                    icon="cross"
                    minimal={true}
                    disabled={!input.conceptMapId}
                    onClick={(_e: React.MouseEvent) => {
                      updateInput({
                        variables: {
                          inputId: input.id,
                          data: { conceptMapId: null }
                        }
                      });
                    }}
                  />
                </ButtonGroup>
              </div>
            )}
            <span className="stretch"></span>
          </div>
        </Card>
        <ConceptMapDialog
          isOpen={isConceptMapOverlayVisible}
          onClose={_ => setConceptMapOverlayVisible(false)}
          currentConceptMap={conceptMap}
          updateInputCallback={(conceptMapId: string) => {
            updateInput({
              variables: {
                inputId: input.id,
                data: { conceptMapId }
              }
            });
            setConceptMapOverlayVisible(false);
          }}
        />
        <Button
          icon={'cross'}
          loading={loadDelInput}
          minimal={true}
          onClick={onClickDelete}
        />
      </div>
    </div>
  );
};

export default InputColumn;
