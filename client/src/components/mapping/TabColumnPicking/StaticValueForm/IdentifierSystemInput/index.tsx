import {
  Button,
  Checkbox,
  ControlGroup,
  InputGroup,
  Tooltip,
  Icon
} from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Attribute } from '@arkhn/fhir.ts';

import { IReduxStore, Resource } from 'types';
import SourceSelect from 'components/selects/sourceSelect';
import ResourceSelect from 'components/selects/resourceSelect';

interface Props {
  attribute: Attribute;
  sources: Source[];
  creatingStaticInput: boolean;
  addStaticValue: (value: string) => Promise<void>;
}

interface Source {
  id: string;
  name: string;
  template: {
    name: string;
  };
  resources: Resource[];
}

const IdentifierSystemInput = ({
  attribute,
  sources,
  creatingStaticInput,
  addStaticValue
}: Props): React.ReactElement => {
  const { source, resource } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );

  const [staticValue, setStaticValue] = useState('');
  const [customSystem, setCustomSystem] = useState(false);
  const [customKeyName, setCustomKeyName] = useState('');
  const [selectedSource, setSelectedSource] = useState(
    undefined as Source | undefined
  );
  const [selectedResource, setSelectedResource] = useState(
    undefined as Resource | undefined
  );

  useEffect(() => {
    if (attribute.parent?.isRootIdentifier) {
      setSelectedSource(source);
      setSelectedResource(resource);
    } else {
      setSelectedSource(undefined);
      setSelectedResource(undefined);
    }
  }, [attribute, source, resource]);

  const handleSourceSelect = (source: Source): void => {
    setSelectedSource(source);
    setSelectedResource(undefined);
  };
  const handleResourceSelect = (resource: Resource): void => {
    setSelectedResource(resource);
  };

  const onClickAddButton = () => {
    if (customSystem) {
      addStaticValue(
        `http://terminology.arkhn.org/${selectedResource!.logicalReference}${
          customKeyName ? '/' + customKeyName : ''
        }`
      );
    } else {
      addStaticValue(staticValue);
    }
  };

  const customSystemTootip = (
    <p className="text">
      The identifier system is a URI that defines a set of identifiers (i.e. how
      the value is made unique). For istance, we use
      "http://hl7.org/fhir/sid/us-ssn" for United States Social Security Number
      (SSN) identifier values. Sometimes, the identifiers are not a recognized
      standard so we need to use a custom system. Pyrog's custom systems have
      the form "http://terminology.arkhn.org/sourceId/resourceId".
    </p>
  );

  return (
    <ControlGroup>
      {customSystem ? (
        <>
          <SourceSelect
            items={sources}
            onChange={handleSourceSelect}
            inputItem={selectedSource || ({} as Source)}
            disabled={attribute.parent?.isRootIdentifier}
          />
          <ResourceSelect
            items={selectedSource?.resources || []}
            onChange={handleResourceSelect}
            inputItem={selectedResource || ({} as Resource)}
            disabled={
              selectedSource === undefined || attribute.parent?.isRootIdentifier
            }
          />
          <InputGroup
            onChange={(event: React.FormEvent<HTMLElement>): void => {
              const target = event.target as HTMLInputElement;
              setCustomKeyName(target.value);
            }}
            placeholder="Custom key name"
            value={customKeyName}
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
      <Button
        disabled={
          (customSystem && selectedResource === undefined) ||
          (!customSystem && staticValue.length === 0)
        }
        icon={'add'}
        loading={creatingStaticInput}
        onClick={onClickAddButton}
      />
      <Checkbox
        className="custom-checkbox"
        checked={customSystem}
        label="Custom system"
        onChange={(): void => setCustomSystem(!customSystem)}
      />
      <Tooltip
        boundary="viewport"
        content={customSystemTootip}
        className="centered-question-mark"
      >
        <Icon icon="help" />
      </Tooltip>
    </ControlGroup>
  );
};

export default IdentifierSystemInput;
