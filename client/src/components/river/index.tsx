import axios from 'axios';
import { Button } from '@blueprintjs/core';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import listBatch from '../../services/batchList/actions';
import getBatchList from '../../services/batchList/selectors';
import StringSelect from '../selects/stringSelect';
import { useQuery } from '@apollo/react-hooks';

import { loader } from 'graphql.macro';

import Navbar from 'components/navbar';
import { IReduxStore } from 'types';

import SourceSelect from 'components/selects/sourceSelect';
import ResourceMultiSelect from 'components/selects/resourceMultiSelect';

import { Resource } from 'types';
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

// GRAPHQL
const qSourcesAndResources = loader(
  'src/graphql/queries/sourcesAndResources.graphql'
);

const FhirRiverView = (): React.ReactElement => {
  const dispatch = useDispatch();
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const batchList = useSelector(getBatchList);

  const [selectedSource, setSelectedSource] = useState({} as Source);
  const [selectedResources, setSelectedResources] = useState([] as Resource[]);
  const [running, setRunning] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');

  const { data } = useQuery(qSourcesAndResources, {
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    dispatch(listBatch());
  }, [dispatch]);

  useEffect(() => {
    if (batchList.error) {
      toaster.show({
        message: `Problem while listing current batches: ${batchList.error}`,
        intent: 'danger',
        icon: 'warning-sign',
        timeout: 6000
      });
    }
  }, [batchList.error, toaster]);

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

  const onClickCreateBatch = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ): Promise<void> => {
    e.preventDefault();
    setRunning(true);

    try {
      await axios.post(
        `${RIVER_URL}/batch`,
        {
          resources: selectedResources.map(r => ({
            // eslint-disable-next-line @typescript-eslint/camelcase
            resource_id: r.id,
            // eslint-disable-next-line @typescript-eslint/camelcase
            resource_type: r.definition.type
          }))
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      dispatch(listBatch());
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

  const onClickCancelBatch = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ): Promise<void> => {
    e.preventDefault();
    if (!selectedBatch) return;
    try {
      await axios.delete(`${RIVER_URL}/batch/${selectedBatch}`);
      dispatch(listBatch());
    } catch (err) {
      const errMessage = err.response ? err.response.data : err.message;
      toaster.show({
        message: `Problem while deleting a batch: ${errMessage}`,
        intent: 'danger',
        icon: 'warning-sign',
        timeout: 6000
      });
    }
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
            onClick={onClickCreateBatch}
          >
            Make the river flow
          </Button>
        </div>
        <h1>Cancel a batch</h1>
        <StringSelect
          items={
            batchList.data
              ? Object.keys(batchList.data).map(
                  (batchId: string) => batchList.data[batchId]
                )
              : []
          }
          inputItem={
            !!selectedBatch && !batchList.error
              ? batchList.data[selectedBatch]
              : 'Select a batch to cancel'
          }
          onChange={(item: string): void => {
            const batchId = Object.keys(batchList.data).find(
              batchId => batchList.data[batchId] === item
            );
            if (batchId) setSelectedBatch(batchId);
          }}
        />
        <div className="align-right">
          <Button
            intent="danger"
            type="submit"
            large
            disabled={!selectedBatch || !!batchList.error}
            className="button-submit"
            onClick={onClickCancelBatch}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FhirRiverView;
