import {
  Button,
  ButtonGroup,
  Card,
  Elevation,
  Position,
  Tag
} from '@blueprintjs/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useSelector, useDispatch } from 'react-redux';
import { loader } from 'graphql.macro';
import { Attribute } from '@arkhn/fhir.ts';

import ColumnSelect from 'components/selects/columnSelect';
import TableViewer from 'components/mapping/TableViewer';

import { onError } from 'services/apollo';
import ScriptSelect from 'components/selects/scriptSelect';
import ConceptMapDialog from 'components/mapping/ConceptMap';
import { setAttributeInMap } from 'services/resourceInputs/actions';
import { ConceptMap, IReduxStore, ISelectedSource, Join } from 'types';
import { FHIR_API_URL } from '../../../../constants';

// GRAPHQL
const mCreateAttribute = loader(
  'src/graphql/mutations/createAttribute.graphql'
);
const mCreateInputGroup = loader(
  'src/graphql/mutations/createInputGroup.graphql'
);
const mCreateSQLInput = loader('src/graphql/mutations/createSQLInput.graphql');

interface Props {
  attribute: Attribute;
  schema: any;
  source: ISelectedSource;
}

const DynamicColumnPicker = ({ attribute, schema, source }: Props) => {
  const dispatch = useDispatch();
  const toaster = useSelector((state: IReduxStore) => state.toaster);

  const { resource, selectedInputGroup } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );
  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );

  const path = attribute.path;
  let attributeId = attributesForResource[path]
    ? attributesForResource[path].id
    : null;
  // The id of the input group in which we want to put the new input.
  // If it is null, it means that we'll need to create a new input group first.
  let inputGroupId =
    selectedInputGroup === null ||
    !attributesForResource[path] ||
    selectedInputGroup >= attributesForResource[path].inputGroups.length
      ? null
      : attributesForResource[path].inputGroups[selectedInputGroup].id;

  const [table, setTable] = useState(resource.primaryKeyTable);
  const [column, setColumn] = useState('');
  const [joins, setJoins] = useState([] as Join[]);
  const [script, setScript] = useState(undefined as string | undefined);
  const [conceptMapId, setConceptMapId] = useState(
    undefined as string | undefined
  );
  const [conceptMap, setConceptMap] = useState(
    undefined as ConceptMap | undefined
  );
  const [isConceptMapOverlayVisible, setConceptMapOverlayVisible] = useState(
    false
  );

  const [createAttribute] = useMutation(mCreateAttribute, {
    onError: onError(toaster)
  });
  const [createInputGroup] = useMutation(mCreateInputGroup, {
    onError: onError(toaster)
  });
  const [
    createSQLInput,
    { loading: creatingSQLInput }
  ] = useMutation(mCreateSQLInput, { onError: onError(toaster) });

  useEffect(() => {
    if (conceptMapId) {
      const fetchConceptMap = async (conceptMapId: string) => {
        const response = await axios.get(
          `${FHIR_API_URL}/ConceptMap/${conceptMapId}`
        );
        if (response.data.resourceType === 'OperationOutcome')
          throw new Error(response.data.issue[0].diagnostics);
        setConceptMap(response.data as ConceptMap);
      };
      fetchConceptMap(conceptMapId).catch(e => {
        console.error(e);
      });
    }
  }, [conceptMapId]);

  const createInput = async (): Promise<void> => {
    try {
      // First, we create the attribute if it doesn't exist
      if (!attributeId) {
        const { data: attr } = await createAttribute({
          variables: {
            resourceId: resource.id,
            definitionId: attribute.types[0],
            path,
            sliceName: attribute.definition.sliceName
          }
        });
        attributeId = attr.createAttribute.id;
      }
      // Then, we create the inputGroup if needed
      if (
        selectedInputGroup === null ||
        !attributesForResource[path] ||
        selectedInputGroup >= attributesForResource[path].inputGroups.length
      ) {
        const { data: group } = await createInputGroup({
          variables: {
            attributeId
          }
        });
        inputGroupId = group.createInputGroup.id;
      }
      // Also, we create the parent attributes if they don't exist
      let currentAttribute = attribute;
      while (currentAttribute.parent) {
        currentAttribute = currentAttribute.parent;
        const parentPath = currentAttribute.path;
        if (
          !attributesForResource[parentPath] &&
          !currentAttribute.isArray &&
          currentAttribute.types.length <= 1
        ) {
          const { data: attr } = await createAttribute({
            variables: {
              resourceId: resource.id,
              definitionId: currentAttribute.types[0],
              path: parentPath,
              sliceName: currentAttribute.definition.sliceName
            }
          });
          dispatch(setAttributeInMap(parentPath, attr.createAttribute));
        }
      }
      const { data } = await createSQLInput({
        variables: {
          inputGroupId,
          script,
          conceptMapId,
          columnInput: {
            table: table,
            column: column,
            joins: joins
          }
        }
      });
      dispatch(setAttributeInMap(path, data.createInput.inputGroup.attribute));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Card elevation={Elevation.ONE}>
        <div className="card-absolute">
          <div className="card-flex">
            <div className="card-tag">Dynamic</div>
            {!source.credential && (
              <div className="card-credentials-missing">
                Database credentials missing
              </div>
            )}
          </div>
        </div>
        <div className="sql-input-form">
          <ColumnSelect
            tableChangeCallback={(e: string) => {
              setTable(e);
              setColumn('');
            }}
            columnChangeCallback={(e: string) => {
              setColumn(e);
            }}
            joinsChangeCallback={(joins: Join[]): void => {
              setJoins(joins);
            }}
            initialTable={table}
            sourceSchema={schema}
            withJoins={true}
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
                selectedScript={script || ''}
                onChange={(script: string) => {
                  setScript(script);
                }}
                onClear={(): void => {
                  setScript(undefined);
                }}
              />
            </div>
          </div>
          {['code', 'string'].includes(attribute.types[0]) && (
            <div className="stacked-tags" onClick={e => e.stopPropagation()}>
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
                  disabled={!conceptMap}
                  onClick={(_e: React.MouseEvent) => {
                    setConceptMap(undefined);
                  }}
                />
              </ButtonGroup>
            </div>
          )}
          <div className="sql-input-form-add-button">
            <Button
              disabled={!attribute || !column}
              icon={'add'}
              loading={creatingSQLInput}
              onClick={createInput}
            />
          </div>
          <span className="stretch"></span>
        </div>
        <TableViewer table={table} />
      </Card>
      <ConceptMapDialog
        isOpen={isConceptMapOverlayVisible}
        onClose={_ => setConceptMapOverlayVisible(false)}
        currentConceptMap={conceptMap}
        updateInputCallback={(conceptMapId: string) => {
          setConceptMapId(conceptMapId);
          setConceptMapOverlayVisible(false);
        }}
      />
    </>
  );
};

export default DynamicColumnPicker;
