import axios from 'axios';
import { Button, MenuItem, Switch } from '@blueprintjs/core';
import { ItemPredicate, MultiSelect, Select } from '@blueprintjs/select';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';

import { loader } from 'graphql.macro';

import Navbar from 'components/navbar';
import { IReduxStore } from 'types';

import { FHIRPIPE_URL } from '../../constants';

import './style.scss';

interface Source {
  id: string;
  name: string;
  template: {
    name: string;
  };
}
interface Resource {
  id: string;
  label: string;
  definitionId: string;
  source: Source;
}

// GRAPHQL
const qSources = loader('src/graphql/queries/sources.graphql');
const qResources = loader('src/graphql/queries/resourcesForUser.graphql');
const qCredentialForSource = loader(
  'src/graphql/queries/credentialIdForSource.graphql'
);

const FhirpipeView = () => {
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const { id: userId } = useSelector((state: IReduxStore) => state.user);

  const [selectedSource, setSelectedSource] = useState({} as Source);
  const [selectedResources, setSelectedResources] = useState([] as Resource[]);
  const [bypassValidation, setBypassValidation] = useState(false);
  const [override, setOverride] = useState(false);
  const [multiprocessing, setMultiprocessing] = useState(false);
  const [running, setRunning] = useState(false);

  const { data: dataSources } = useQuery(qSources, {
    fetchPolicy: 'network-only'
  });
  const { data: dataResources } = useQuery(qResources, {
    variables: {
      userId
    },
    fetchPolicy: 'network-only'
  });
  const sources = dataSources ? dataSources.sources : [];
  const resources = dataResources ? dataResources.resourcesForUser : [];

  const resourcesForSelectedSource = resources.filter(
    (r: Resource) => r.source.id === selectedSource.id
  );

  const { data: dataCredential, loading: loadingCredentials } = useQuery(
    qCredentialForSource,
    {
      variables: { sourceId: selectedSource.id },
      skip: !selectedSource.id
    }
  );
  const credentials = dataCredential && dataCredential.source.credential;
  const credentialsMissing =
    !!selectedSource.name && !loadingCredentials && !credentials;

  const SourceSelect = Select.ofType<Source>();
  const ResourceMultiSelect = MultiSelect.ofType<Resource>();

  const isItemSelected = (list: any[], item: any): boolean => {
    return list.includes(item);
  };

  const handleSourceSelect = (source: Source): void => {
    setSelectedSource(source);
  };
  const handleResourceSelect = (resource: Resource): void => {
    if (!isItemSelected(selectedResources, resource)) {
      setSelectedResources([...selectedResources, resource]);
    } else {
      selectedResources.splice(selectedResources.indexOf(resource), 1);
      setSelectedResources([...selectedResources]);
    }
  };

  const renderSource = (source: Source, { handleClick }: any) => (
    <MenuItem
      key={source.id}
      text={source.name}
      label={source.template.name}
      onClick={handleClick}
      shouldDismissPopover={false}
    />
  );

  const renderResource = (resource: Resource, { handleClick }: any) => (
    <MenuItem
      key={resource.id}
      text={resource.definitionId}
      label={resource.label}
      icon={isItemSelected(selectedResources, resource) ? 'tick' : 'blank'}
      onClick={handleClick}
      shouldDismissPopover={false}
    />
  );

  const handleTagRemove = (_value: string, index: number): void => {
    selectedResources.splice(index, 1);
    setSelectedResources([...selectedResources]);
  };

  const filterSource: ItemPredicate<Source> = (query, source) => {
    return source.name.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  };

  const onFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setRunning(true);

    // The possible params for running fhirpipe are:
    // mapping, sources, resources, labels, override,
    // chunksize, bypass_validation, multiprocessing
    // It is also needed to provide credentialId
    const body = {
      source: selectedSource.name,
      resources: selectedResources.map(r => r.definitionId),
      labels: selectedResources.map(r => r.label),
      credentialId: credentials.id,
      bypass_validation: bypassValidation,
      override: override,
      multiprocessing: multiprocessing
    };
    const headers = { 'Content-Type': 'application/json' };

    try {
      await axios.post(`${FHIRPIPE_URL}/run`, body, {
        headers: headers
      });

      toaster.show({
        message: 'Fhirpipe ran successfully',
        intent: 'success',
        icon: 'tick-circle',
        timeout: 4000
      });
    } catch (err) {
      const errMessage = err.response ? err.response.data : err.message;
      toaster.show({
        message: `Problem while running Fhirpipe: ${errMessage}`,
        intent: 'danger',
        icon: 'warning-sign',
        timeout: 6000
      });
    }
    setRunning(false);
  };

  return (
    <div>
      <Navbar />
      <div id="main-div">
        <form onSubmit={onFormSubmit}>
          <h1>Select source</h1>
          <p>
            Choose the source you want to process with the ETL. Note that you
            need to provide the credentials for the source database before.
          </p>
          <SourceSelect
            items={sources}
            itemRenderer={renderSource}
            onItemSelect={handleSourceSelect}
            itemPredicate={filterSource}
            noResults={<MenuItem disabled={true} text="No results." />}
            itemsEqual="id"
          >
            <Button
              icon="database"
              rightIcon="caret-down"
              text={
                selectedSource.name
                  ? `${selectedSource.name} (${selectedSource.template.name})`
                  : '(Select a source)'
              }
            />
          </SourceSelect>
          {credentialsMissing && (
            <b className="creds-alert">
              No credentials provided for this source.
            </b>
          )}
          <h1>Select resources</h1>
          <p>
            Choose all the resources you want to process with the ETL. If you
            select none of them, all we be processed. Note that you need to
            select a source before.
          </p>
          <ResourceMultiSelect
            items={resourcesForSelectedSource}
            tagRenderer={resource => resource.definitionId}
            tagInputProps={{
              onRemove: handleTagRemove
            }}
            itemRenderer={renderResource}
            onItemSelect={handleResourceSelect}
            selectedItems={selectedResources}
            itemsEqual="id"
            fill={true}
            noResults={
              <MenuItem
                disabled={true}
                text="No resources for the selected source."
              />
            }
          />
          <div className="advanced-options">
            <h2>Advanced options</h2>
            {/* TODO utlimately, these options should only be accessible to admin users. */}
            <div>
              <Switch
                checked={override}
                label="override"
                onChange={(): void => setOverride(prev => !prev)}
              />
              <Switch
                checked={bypassValidation}
                label="bypass_validation"
                onChange={(): void => setBypassValidation(prev => !prev)}
              />
              <Switch
                checked={multiprocessing}
                label="multiprocessing"
                onChange={(): void => setMultiprocessing(prev => !prev)}
              />
            </div>
            <div className="align-right">
              <Button
                intent="primary"
                large
                type="submit"
                disabled={!selectedSource.id || credentialsMissing}
                loading={running}
                className="button-submit"
              >
                Run the pipe
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FhirpipeView;
