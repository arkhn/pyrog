import {
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
  value: string;
  attribute: Attribute;
  sources: Source[];
  onUpdate: (value: string) => Promise<void>;
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
  value,
  attribute,
  sources,
  onUpdate
}: Props): React.ReactElement => {
  const { source, resource } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );

  const [staticValue, setStaticValue] = useState(value);
  const [customSystem, setCustomSystem] = useState(false);
  const [customKeyName, setCustomKeyName] = useState('');
  const [selectedSource, setSelectedSource] = useState(
    undefined as Source | undefined
  );
  const [selectedResource, setSelectedResource] = useState(
    undefined as Resource | undefined
  );

  const updateCustomSystem = () => {
    onUpdate(
      `http://terminology.arkhn.org/${selectedResource?.logicalReference ||
        ''}${customKeyName ? '/' + customKeyName : ''}`
    );
  };

  useEffect(() => {
    setStaticValue(value);
  }, [value]);

  useEffect(() => {
    if (attribute.parent?.isRootIdentifier) {
      setSelectedSource(source);
      setSelectedResource(resource);
    } else {
      setSelectedSource(undefined);
      setSelectedResource(undefined);
    }
  }, [attribute, source, resource]);

  useEffect(() => {
    if (customSystem) {
      updateCustomSystem();
    }
  }, [customSystem, selectedResource]);

  const handleSourceSelect = (source: Source): void => {
    setSelectedSource(source);
    setSelectedResource(undefined);
  };
  const handleResourceSelect = (resource: Resource): void => {
    setSelectedResource(resource);
  };

  const customSystemTootip = (
    <p className="text">
      The identifier system is a URI that defines a set of identifiers (i.e. how
      the value is made unique). For istance, we use
      "http://hl7.org/fhir/sid/us-ssn" for United States Social Security Number
      (SSN) identifier values. Sometimes, the identifiers are not a recognized
      standard so we need to use a custom system. Pyrog's custom systems have
      the form "http://terminology.arkhn.org/reference-id/custom-key".
    </p>
  );

  return (
    <ControlGroup>
      {customSystem ? (
        <React.Fragment>
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
            placeholder="Custom key name"
            value={customKeyName}
            onChange={(event: React.FormEvent<HTMLElement>): void => {
              const target = event.target as HTMLInputElement;
              setCustomKeyName(target.value);
            }}
            onBlur={updateCustomSystem}
          />
        </React.Fragment>
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
