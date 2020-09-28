import axios from 'axios';
import { Button, Switch } from '@blueprintjs/core';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';

import { loader } from 'graphql.macro';

import Navbar from 'components/navbar';
import { IReduxStore } from 'types';

import SourceSelect from 'components/selects/sourceSelect';
import ResourceMultiSelect from 'components/selects/resourceMultiSelect';

import { RIVER_URL } from '../../constants';

import './style.scss';

interface Source {
  id: string;
  name: string;
  template: {
    name: string;
  };
  credential: {
    id: string;
  };
  resources: Resource[];
}
interface Resource {
  id: string;
  label: string;
  definitionId: string;
}

// GRAPHQL
const qSourcesAndResources = loader(
  'src/graphql/queries/sourcesAndResources.graphql'
);

const FhirRiverView = (): React.ReactElement => {
  const toaster = useSelector((state: IReduxStore) => state.toaster);

  const [selectedSource, setSelectedSource] = useState({} as Source);
  const [selectedResources, setSelectedResources] = useState([] as Resource[]);
  const [running, setRunning] = useState(false);

  const { data } = useQuery(qSourcesAndResources, {
    fetchPolicy: 'no-cache'
  });

  const sources = data ? data.sources : [];
  const credentials = selectedSource.id ? selectedSource.credential : undefined;
  const credentialsMissing = !!selectedSource.id && !credentials;

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
  const handleSelectAll = (): void => {
    if (selectedResources.length === selectedSource.resources.length) {
      setSelectedResources([]);
    } else {
      setSelectedResources([...selectedSource.resources]);
    }
  };

  const handleTagRemove = (_value: string, index: number): void => {
    selectedResources.splice(index, 1);
    setSelectedResources([...selectedResources]);
  };

  const onClickRun = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ): Promise<void> => {
    e.preventDefault();
    setRunning(true);

    try {
      await axios.post(
        `${RIVER_URL}/batch`,
        {
          resources: selectedResources.map(r => ({
            resource_id: r.id,
            resource_type: r.definitionId
          }))
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      toaster.show({
        message: 'fhir-river ran successfully',
        intent: 'success',
        icon: 'tick-circle',
        timeout: 4000
      });
    } catch (err) {
      const errMessage = err.response ? err.response.data : err.message;
      toaster.show({
        message: `Problem while running fhir-river: ${errMessage}`,
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
        <h1>Select source</h1>
        <p>
          Choose the source you want to process with the ETL. Note that you need
          to provide the credentials for the source database before.
        </p>
        <SourceSelect
          items={sources}
          onChange={handleSourceSelect}
          inputItem={selectedSource}
        />
        {credentialsMissing && (
          <b className="creds-alert">
            No credentials provided for this source.
          </b>
        )}
        <h1>Select resources</h1>
        <p>
          Choose all the resources you want to process with the ETL. If you
          select none of them, all we be processed. Note that you need to select
          a source before.
        </p>
        <ResourceMultiSelect
          resources={selectedSource.resources || []}
          selectedResources={selectedResources}
          onResourceSelect={handleResourceSelect}
          onSelectAll={handleSelectAll}
          onRemoveTag={handleTagRemove}
        />
        <div className="align-right">
          <Button
            intent="primary"
            large
            type="submit"
            disabled={!selectedSource.id || credentialsMissing}
            loading={running}
            className="button-submit"
            onClick={onClickRun}
          >
            Make the river flow
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FhirRiverView;
