import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  Elevation,
  IBreadcrumbProps,
  Tag
} from '@blueprintjs/core';
import React, { useState } from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';

import { IReduxStore, ISelectedSource } from 'types';

// COMPONENTS
import Join from '../Join';
import ConceptMapDialog from 'components/mapping/ConceptMap';
import ScriptSelect from 'components/selects/scriptSelect';
import { loader } from 'graphql.macro';

// ACTIONS
import { removeAttributeFromMap } from 'services/resourceInputs/actions';

// GRAPHQL
const qInputsForAttribute = loader(
  'src/graphql/queries/inputsForAttribute.graphql'
);
const mUpdateInput = loader('src/graphql/mutations/updateInput.graphql');
const mDeleteInput = loader('src/graphql/mutations/deleteInput.graphql');
const mDeleteAttribute = loader(
  'src/graphql/mutations/deleteAttribute.graphql'
);
const mAddJoinToColumn = loader(
  'src/graphql/mutations/addJoinToColumn.graphql'
);

interface Props {
  input: any;
  schema: any;
  source: ISelectedSource;
}

const InputColumn = ({ input, schema, source }: Props) => {
  const client = useApolloClient();
  const dispatch = useDispatch();

  const { attribute } = useSelector((state: IReduxStore) => state.selectedNode);
  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );
  const attributeId = attributesForResource[attribute.path].id;

  const [isConceptMapOverlayVisible, setConceptMapOverlayVisible] = useState(
    false
  );

  const [deleteInput, { loading: loadDelInput }] = useMutation(mDeleteInput);
  const [deleteAttribute] = useMutation(mDeleteAttribute);
  const [addJoinToColumn, { loading: loadAddJoin }] = useMutation(
    mAddJoinToColumn
  );
  const [updateInput, { loading: loadUpdInput }] = useMutation(mUpdateInput);

  const removeInputFromCache = (cache: any) => {
    const { attribute: dataAttribute } = cache.readQuery({
      query: qInputsForAttribute,
      variables: {
        attributeId: attributeId
      }
    });
    const newDataAttribute = {
      ...dataAttribute,
      inputs: dataAttribute.inputs.filter((i: any) => i.id !== input.id)
    };
    cache.writeQuery({
      query: qInputsForAttribute,
      variables: {
        attributeId: attributeId
      },
      data: { attribute: newDataAttribute }
    });
  };

  const onClickDelete = async () => {
    // Mutation to remove from DB
    await deleteInput({
      variables: {
        id: input.id
      },
      update: removeInputFromCache
    });

    // Remove attribute from map and DB if it was last input
    const { data: dataInputs } = await client.query({
      query: qInputsForAttribute,
      variables: {
        attributeId: attributeId
      }
    });

    if (dataInputs.attribute.inputs.length === 0) {
      deleteAttribute({
        variables: {
          attributeId
        }
      });
      dispatch(removeAttributeFromMap(attribute.path));
    }
  };

  return (
    <div className="input-column">
      <Button
        icon={'trash'}
        loading={loadDelInput}
        minimal={true}
        onClick={onClickDelete}
      />
      <Card elevation={Elevation.ONE} className="input-column-info">
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
                items={
                  source.hasOwner
                    ? [
                        {
                          text: (
                            <div className="stacked-tags">
                              <Tag minimal={true}>OWNER</Tag>
                              <Tag intent={'success'} large={true}>
                                {input.sqlValue.owner}
                              </Tag>
                            </div>
                          )
                        },
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
                      ]
                    : [
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
                      ]
                }
              />
              <div className="stacked-tags">
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
              {attribute.types[0] === 'code' && (
                <div className="stacked-tags">
                  <Tag>CONCEPT MAP</Tag>
                  <ButtonGroup>
                    <Button
                      text={input.conceptMap || 'None'}
                      onClick={(_e: React.MouseEvent) => {
                        setConceptMapOverlayVisible(true);
                      }}
                    />
                    <Button
                      className="delete-button"
                      icon="cross"
                      minimal={true}
                      disabled={!input.conceptMap}
                      onClick={(_e: React.MouseEvent) => {
                        updateInput({
                          variables: {
                            inputId: input.id,
                            data: { conceptMap: null }
                          }
                        });
                      }}
                    />
                  </ButtonGroup>
                </div>
              )}
            </div>
            <div className="input-column-joins">
              <Button
                icon={'add'}
                loading={loadAddJoin}
                onClick={() => {
                  addJoinToColumn({
                    variables: {
                      columnId: input.sqlValue.id
                    }
                  });
                }}
              >
                Add Join
              </Button>
              {input.sqlValue.joins
                ? input.sqlValue.joins.map((join: any, index: number) => (
                    <Join
                      key={index}
                      joinData={join}
                      schema={schema}
                      source={source}
                    />
                  ))
                : null}
            </div>
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
