import axios from 'axios';
import { Button, Tag } from '@blueprintjs/core';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import listBatch from '../../services/batchList/actions';
import getBatchList from '../../services/batchList/selectors';
import StringSelect from '../selects/stringSelect';
import { useQuery } from '@apollo/react-hooks';
import { useSnackbar } from 'notistack';

import { loader } from 'graphql.macro';

import Navbar from 'components/navbar';

import SourceSelect from 'components/selects/sourceSelect';
import ResourceMultiSelect from 'components/selects/resourceMultiSelect';

import { Resource } from 'types';
import { RIVER_URL } from '../../constants';
import { UPDATE_FREQUENCIES } from 'components/river/constants';

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

const UPDATE_FREQUENCY_CHOICES = Object.keys(UPDATE_FREQUENCIES)

const FhirRiverView = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { data: batchList, error: batchListError } = useSelector(getBatchList);

  const [selectedSource, setSelectedSource] = useState({} as Source);
  const [selectedResources, setSelectedResources] = useState([] as Resource[]);
  const [selectedFrequency, setSelectedFrequency] = useState(UPDATE_FREQUENCY_CHOICES[0]);
  const [running, setRunning] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('');

  const { data } = useQuery(qSourcesAndResources, {
    fetchPolicy: 'no-cache'
  });

  useEffect(() => {
    dispatch(listBatch());
  }, [dispatch]);

  useEffect(() => {
    if (batchListError) {
      enqueueSnackbar(
        `Problem while listing current batches: ${batchListError}`,
        {
          variant: 'error'
        }
      );
    }
  }, [batchListError, enqueueSnackbar]);

  const sources = data ? data.sources : [];
  const resources =
    sources.length > 0
      ? sources
          .map((source: any) => source.resources)
          .reduce(
            (acc: Resource[], resources: Resource[]) => [...acc, ...resources],
            []
          )
      : [];
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

  const handleClickCreateBatch = async (): Promise<void> => {
    setRunning(true);
    const runOnce = selectedFrequency === "run once"
    const route =  runOnce? "api/batch/" : "api/update-batch/";
    var body: any = {
      resources: selectedResources.map(r => ({
        // eslint-disable-next-line @typescript-eslint/camelcase
        resource_id: r.id,
        // eslint-disable-next-line @typescript-eslint/camelcase
        resource_type: r.definition.type
      }))
    }
    if (!runOnce) {
      body = {
        schedule_interval: UPDATE_FREQUENCIES[selectedFrequency],
        ...body
      }
    }
    try {
      await axios.post(
        `${RIVER_URL}/${route}`,
        body,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      dispatch(listBatch());

      enqueueSnackbar(`Batch was successfully created`, {
        variant: 'success'
      });
    } catch (err) {
      const errMessage = err.response ? err.response.data : err.message;
      enqueueSnackbar(`Error while creating batch ${errMessage}`, {
        variant: 'error'
      });
    }
    setRunning(false);
  };

  const handleClickCancelBatch = async (): Promise<void> => {
    if (!selectedBatch) return;
    try {
      await axios.delete(`${RIVER_URL}/api/batch/${selectedBatch}/`);
      setSelectedBatch('');
      dispatch(listBatch());
    } catch (err) {
      const errMessage = err.response ? err.response.data : err.message;
      enqueueSnackbar(`Problem while deleting a batch: ${errMessage}`, {
        variant: 'error'
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
          Choose all the resources you want to process with the ETL. Note that
          you need to select a source before
        </p>
        <ResourceMultiSelect
          resources={selectedSource.resources || []}
          selectedResources={selectedResources}
          onResourceSelect={handleResourceSelect}
          onSelectAll={handleSelectAll}
          onRemoveTag={handleTagRemove}
        />
        <h1>Select an update frequency</h1>
        <p>
          Select the frequency at which you want the batch to be re-run in order to update your fhir warehouse.
          Choose "run once" if you don't want any automatic update.
        </p>
        <StringSelect
          items={UPDATE_FREQUENCY_CHOICES}
          inputItem={selectedFrequency}
          doSort={false}
          onChange={(freq: string): void => setSelectedFrequency(freq)}
        />
        <div className="align-right">
          <Button
            intent="primary"
            large
            disabled={!selectedSource.id || credentialsMissing}
            loading={running}
            className="button-submit"
            onClick={handleClickCreateBatch}
          >
            Make the river flow
          </Button>
        </div>
        <h1>Cancel a batch</h1>
        <StringSelect
          items={
            batchList
              ? Object.keys(batchList).map(
                  (batchId: string) => batchList[batchId].timestamp
                )
              : []
          }
          inputItem={
            !!selectedBatch && !batchListError
              ? batchList[selectedBatch].timestamp
              : 'Select a batch to cancel'
          }
          onChange={(item: string): void => {
            const batchId = Object.keys(batchList).find(
              batchId => batchList[batchId].timestamp === item
            );
            if (batchId) setSelectedBatch(batchId);
          }}
        />
        {selectedBatch ? (
          <div>
            <h2>The selected batch contains the following resources</h2>
            <ul>
              {!!selectedBatch &&
                batchList[selectedBatch].resources.map(resource => {
                  return (
                    <li key={resource.resource_id}>
                      <Tag>
                        {
                          resources.find(
                            (r: Resource) => r.id === resource.resource_id
                          ).definition.type
                        }
                      </Tag>
                    </li>
                  );
                })}
            </ul>
          </div>
        ) : null}
        <div className="align-right">
          <Button
            intent="danger"
            large
            disabled={!selectedBatch || !!batchList.error}
            className="button-submit"
            onClick={handleClickCancelBatch}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FhirRiverView;
