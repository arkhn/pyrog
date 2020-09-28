import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  Elevation,
  IBreadcrumbProps,
  Tag
} from '@blueprintjs/core';
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

import { onError as onApolloError } from 'services/apollo';
import { IReduxStore } from 'types';
import { FHIR_API_URL } from '../../../constants';

// COMPONENTS
import Join from '../Join';
import ConceptMapDialog from 'components/mapping/ConceptMap';
import ScriptSelect from 'components/selects/scriptSelect';
import { loader } from 'graphql.macro';
import { setAttributeInMap } from 'services/resourceInputs/actions';

// GRAPHQL
const qInputsForAttribute = loader(
  'src/graphql/queries/inputsForAttribute.graphql'
);
const mUpdateInput = loader('src/graphql/mutations/updateInput.graphql');
const mDeleteInput = loader('src/graphql/mutations/deleteInput.graphql');
const mAddJoinToColumn = loader(
  'src/graphql/mutations/addJoinToColumn.graphql'
);

interface Props {
  input: any;
}

const resolveConceptMapTitle = async (
  conceptMapId: string
): Promise<string> => {
  try {
    const response = await axios.get(
      `${FHIR_API_URL}/ConceptMap/${conceptMapId}`
    );
    return response.data.title;
  } catch (err) {
    console.error(
      `Could not fecth concept map with id ${conceptMapId}: ${err}`
    );
    return '';
  }
};

const InputColumn = ({ input }: Props) => {
  const dispatch = useDispatch();

  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const onError = onApolloError(toaster);
  const { attribute, resource } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );
  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );
  const attributeId = attributesForResource[attribute.path].id;

  const [conceptMapTitle, setConceptMapTitle] = useState('None');
  const [resolvingConceptMapTitle, setResolvingConceptMapTitle] = useState(
    false
  );
  const [isConceptMapOverlayVisible, setConceptMapOverlayVisible] = useState(
    false
  );

  const [deleteInput, { loading: loadDelInput }] = useMutation(mDeleteInput, {
    onError
  });
  const [
    addJoinToColumn,
    { loading: loadAddJoin }
  ] = useMutation(mAddJoinToColumn, { onError });
  const [updateInput, { loading: loadUpdInput }] = useMutation(mUpdateInput, {
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

  const setTitle = useCallback(async (conceptMapId) => {
    setResolvingConceptMapTitle(true);
    const title = await resolveConceptMapTitle(conceptMapId);
    setConceptMapTitle(title);
    setResolvingConceptMapTitle(false);
  }, []);

  useEffect(() => {
    if (input.conceptMapId) {
      setTitle(input.conceptMapId);
    } else {
      setConceptMapTitle('None');
    }
  }, [input.conceptMapId, setTitle]);

  return (
    <div className="input-column">
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
              <div className="stacked-tags" onClick={e => e.stopPropagation()}>
                <Tag>SCRIPT</Tag>
                <ScriptSelect
                  loading={loadUpdInput}
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
              {['code', 'string'].includes(attribute.types[0]) && (
                <div
                  className="stacked-tags"
                  onClick={e => e.stopPropagation()}
                >
                  <Tag>CONCEPT MAP</Tag>
                  <ButtonGroup>
                    <Button
                      text={conceptMapTitle}
                      onClick={(_e: React.MouseEvent) => {
                        setConceptMapOverlayVisible(true);
                      }}
                      loading={resolvingConceptMapTitle}
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
            </div>
            {input.sqlValue.table !== resource.primaryKeyTable && (
              <div
                className="input-column-joins"
                onClick={e => e.stopPropagation()}
              >
                <Button
                  icon={'add'}
                  loading={loadAddJoin}
                  onClick={() => {
                    addJoinToColumn({
                      variables: {
                        columnId: input.sqlValue.id,
                        join: {
                          source: {
                            table: resource.primaryKeyTable
                          },
                          target: {
                            table: input.sqlValue.table
                          }
                        }
                      }
                    });
                  }}
                >
                  Add Join
                </Button>
                {input.sqlValue.joins
                  ? input.sqlValue.joins.map((join: any, index: number) => (
                      <Join key={index} joinData={join} />
                    ))
                  : null}
              </div>
            )}
          </div>
        )}
      </Card>
      <ConceptMapDialog
        isOpen={isConceptMapOverlayVisible}
        onClose={_ => setConceptMapOverlayVisible(false)}
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
    </div>
  );
};

export default InputColumn;
