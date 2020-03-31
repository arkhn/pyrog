import {
  Button,
  Card,
  Checkbox,
  ControlGroup,
  Elevation,
  FormGroup,
  InputGroup,
  Popover,
  Position
} from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { loader } from 'graphql.macro';
import { Attribute } from '@arkhn/fhir.ts';

import { onError } from 'services/apollo';
import { IReduxStore } from 'types';

import { setAttributeInMap } from 'services/resourceInputs/actions';
import StringSelect from 'components/selects/stringSelect';
import SourceSelect from 'components/selects/sourceSelect';
import ResourceSelect from 'components/selects/resourceSelect';

import { Resource } from 'types';

// GRAPHQL
const qBasicFhirTypes = loader('src/graphql/queries/basicFhirTypes.graphql');
const qInputsForAttribute = loader(
  'src/graphql/queries/inputsForAttribute.graphql'
);
const qSourcesAndResources = loader(
  'src/graphql/queries/sourcesAndResources.graphql'
);
const mCreateAttribute = loader(
  'src/graphql/mutations/createAttribute.graphql'
);
const mCreateStaticInput = loader(
  'src/graphql/mutations/createStaticInput.graphql'
);

interface Props {
  attribute: Attribute;
}

interface Source {
  id: string;
  name: string;
  template: {
    name: string;
  };
  resources: Resource[];
}

const StaticValueForm = ({ attribute }: Props) => {
  const dispatch = useDispatch();

  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const { source, resource } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );
  const attributesForResource = useSelector(
    (state: IReduxStore) => state.resourceInputs.attributesMap
  );

  // If the current attribute is the identifier of the resource and not a Reference identifier
  const isIdentifierSystem = /^identifier\[\d+\]\.system$/.test(attribute.path);

  const [staticValue, setStaticValue] = useState('');
  const [customSystem, setCustomSystem] = useState(false);
  const [selectedSource, setSelectedSource] = useState(
    undefined as Source | undefined
  );
  const [selectedResource, setSelectedResource] = useState(
    undefined as Resource | undefined
  );

  const [
    getFhirTypes,
    { data: dataFhirTypes, loading: loadingFhirTypes }
  ] = useLazyQuery(qBasicFhirTypes, {
    fetchPolicy: 'cache-first'
  });
  const { data: dataSources } = useQuery(qSourcesAndResources);

  const sources = dataSources ? dataSources.sources : [];
  const path = attribute.path;
  let attributeId = attributesForResource[path]
    ? attributesForResource[path].id
    : null;

  useEffect(() => {
    if (attribute.isReferenceType) {
      setStaticValue('');
      getFhirTypes();
    }
    if (isIdentifierSystem) {
      setSelectedSource(source);
      setSelectedResource(resource);
    } else {
      setSelectedSource(undefined);
      setSelectedResource(undefined);
    }
  }, [attribute]);

  const addInputToCache = (cache: any, { data: { createInput } }: any) => {
    try {
      const { attribute: dataAttribute } = cache.readQuery({
        query: qInputsForAttribute,
        variables: {
          attributeId
        }
      });
      cache.writeQuery({
        query: qInputsForAttribute,
        variables: {
          attributeId
        },
        data: {
          attribute: {
            ...dataAttribute,
            inputs: [...dataAttribute.inputs, createInput]
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [createAttribute] = useMutation(mCreateAttribute, {
    onError: onError(toaster)
  });
  const [createStaticInput, { loading: creatingStaticInput }] = useMutation(
    mCreateStaticInput,
    {
      update: addInputToCache,
      onError: onError(toaster)
    }
  );

  const onAddStaticValue = async (): Promise<void> => {
    try {
      if (!attributeId) {
        // First, we create the attribute if it doesn't exist
        const { data: attr } = await createAttribute({
          variables: {
            resourceId: resource.id,
            definitionId: attribute.types[0],
            path
          }
        });
        attributeId = attr.createAttribute.id;
        dispatch(setAttributeInMap(path, attr.createAttribute));
      }
      // Also, we create the parent attributes if they don't exist
      let currentAttribute = attribute;
      while (currentAttribute.parent) {
        currentAttribute = currentAttribute.parent;
        const parentPath = currentAttribute.path;
        if (
          !attributesForResource[parentPath] &&
          !currentAttribute.isArray &&
          !(currentAttribute.types.length > 1)
        ) {
          const { data: attr } = await createAttribute({
            variables: {
              resourceId: resource.id,
              definitionId: currentAttribute.types[0],
              path: parentPath
            }
          });
          attributeId = attr.createAttribute.id;
          dispatch(setAttributeInMap(path, attr.createAttribute));
        }
      }
      await createStaticInput({
        variables: {
          attributeId,
          staticValue: customSystem
            ? `http://terminology.arkhn.org/${selectedSource!.id}/${
                selectedResource!.id
              }`
            : staticValue
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const renderAddStaticValueButton = (): React.ReactElement => (
    <Button
      disabled={
        (!customSystem && staticValue.length === 0) ||
        (customSystem && selectedResource === undefined)
      }
      icon={'add'}
      loading={creatingStaticInput}
      onClick={onAddStaticValue}
    />
  );

  const handleSourceSelect = (source: Source): void => {
    setSelectedSource(source);
    setSelectedResource(undefined);
  };
  const handleResourceSelect = (resource: Resource): void => {
    setSelectedResource(resource);
  };

  const renderCustomSystemInput = (): React.ReactElement => (
    <ControlGroup>
      {customSystem ? (
        <>
          <SourceSelect
            items={sources}
            onChange={handleSourceSelect}
            inputItem={selectedSource || ({} as Source)}
            disabled={isIdentifierSystem}
          />
          <ResourceSelect
            items={selectedSource?.resources || []}
            onChange={handleResourceSelect}
            inputItem={selectedResource || ({} as Resource)}
            disabled={selectedSource === undefined || isIdentifierSystem}
          />
        </>
      ) : (
        <InputGroup
          onChange={(event: React.FormEvent<HTMLElement>): void => {
            const target = event.target as HTMLInputElement;
            setStaticValue(target.value);
          }}
          placeholder="Static input"
          value={staticValue}
        />
      )}
      {renderAddStaticValueButton()}
      <Checkbox
        className="custom-checkbox"
        checked={customSystem}
        label="Custom system"
        onChange={(): void => setCustomSystem(!customSystem)}
      />
      <Popover
        interactionKind="hover"
        boundary="viewport"
        className="help-popover"
        position={Position.BOTTOM_RIGHT}
      >
        <Button icon="help" minimal={true} small={true} />
        {
          <div>
            <p className="text">
              The identifier system is a URI that defines a set of identifiers
              (i.e. how the value is made unique). For istance, we use
              "http://hl7.org/fhir/sid/us-ssn" for United States Social Security
              Number (SSN) identifier values. Sometimes, the identifiers are not
              a recognized standard so we need to use a custom system. Pyrog's
              custom systems have the form
              "http://terminology.arkhn.org/sourceId/resourceId".
            </p>
          </div>
        }
      </Popover>
    </ControlGroup>
  );

  return (
    <Card elevation={Elevation.ONE}>
      <div className="card-absolute">
        <div className="card-flex">
          <div className="card-tag">Static</div>
        </div>
      </div>
      <FormGroup labelFor="text-input" inline={true}>
        <ControlGroup>
          {attribute.definition.id === 'Reference.type' ? (
            <>
              <StringSelect
                items={
                  loadingFhirTypes || !dataFhirTypes
                    ? []
                    : dataFhirTypes.structureDefinitions.map((t: any) => t.name)
                }
                onChange={setStaticValue}
                loading={loadingFhirTypes}
                inputItem={staticValue}
              />
              {renderAddStaticValueButton()}
            </>
          ) : attribute.definition.id === 'Identifier.system' ? (
            renderCustomSystemInput()
          ) : (
            <>
              <InputGroup
                id="static-value-input"
                onChange={(event: React.FormEvent<HTMLElement>): void => {
                  const target = event.target as HTMLInputElement;
                  setStaticValue(target.value);
                }}
                placeholder="Static input"
                value={staticValue}
              />
              {renderAddStaticValueButton()}
            </>
          )}
        </ControlGroup>
      </FormGroup>
    </Card>
  );
};

export default StaticValueForm;
