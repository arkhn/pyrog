import * as React from 'react';
import { Tab, Tabs, TabId } from '@blueprintjs/core';
import { loader } from 'graphql.macro';
import { useApolloClient } from 'react-apollo';
import { useSelector } from 'react-redux';
import axios from 'axios';

import Navbar from 'components/navbar';
import InputColumns from './InputGroups';
import TabColumnSuggestion from './TabColumnSuggestion';
import TabColumnPicking from './TabColumnPicking';
import TabSQLParser from './TabSQLParser';
import Comments from './Comments';
import FhirMappingPanel from './FhirMappingPanel';

import { IReduxStore } from 'types';
import { FHIR_API_URL } from '../../constants';

import './style.scss';
import TableViewer from './TableViewer';

const qExportMapping = loader('src/graphql/queries/exportMapping.graphql');

const MappingView = () => {
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const { source, resource, attribute } = useSelector(
    (state: IReduxStore) => state.selectedNode
  );
  const [selectedTabId, setSelectedTabId] = React.useState('picker' as TabId);

  const client = useApolloClient();

  const exportMapping = async (includeComments = true): Promise<void> => {
    const { data, errors } = await client.query({
      query: qExportMapping,
      variables: {
        sourceId: source.id,
        includeComments
      },
      fetchPolicy: 'network-only'
    });

    if (errors && errors.length) {
      toaster.show({
        icon: 'error',
        intent: 'danger',
        message: 'error while exporting mapping',
        timeout: 4000
      });
      return;
    }

    if (data) {
      const {
        source: { mapping, template, name }
      } = data;
      const fileName = `${template.name}_${name}_mapping.json`;
      const element = document.createElement('a');
      const file = new File(
        [mapping],
        `${template.name}_${name}_mapping.json`,
        {
          type: 'application/json'
        }
      );
      element.href = URL.createObjectURL(file);
      element.download = fileName;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    }
  };

  const augmentAdditionalBundle = async (
    ids: string[],
    type: 'ConceptMap' | 'StructureDefinition',
    bundle: any
  ): Promise<void> => {
    try {
      const response: any = await axios.get(
        `${FHIR_API_URL}/${type}?id=${ids.join(',')}`
      );
      bundle.entry = [
        ...bundle.entry,
        ...response.data.entry
          // exact modifier in search doesn't work with several queries
          // TODO remove when
          .filter((newEntry: any) => ids.includes(newEntry.resource.id))
          .map((newEntry: any) => {
            const {
              resource: { _id, ...resourceWithoutId }
            } = newEntry;
            return { resource: { ...resourceWithoutId } };
          })
      ];
    } catch (err) {
      const errMessage = err.response ? err.response.data : err.message;
      toaster.show({
        icon: 'error',
        intent: 'danger',
        message: `error while fetching additional resources: ${errMessage}`,
        timeout: 4000
      });
    }
  };

  const exportAdditionalResource = async (
    conceptMapIds: string[],
    profileIds: string[]
  ): Promise<void> => {
    const bundle: any = { resourceType: 'Bundle', entry: [] };

    // Add concept maps to bundle
    await augmentAdditionalBundle(conceptMapIds, 'ConceptMap', bundle);

    // Add profiles to bundle
    await augmentAdditionalBundle(profileIds, 'StructureDefinition', bundle);

    if (bundle.entry.length > 0) {
      const fileName = `${source.template.name}_${source.name}_additional_resources.json`;
      const element = document.createElement('a');
      const file = new File([JSON.stringify(bundle)], fileName, {
        type: 'application/json'
      });
      element.href = URL.createObjectURL(file);
      element.download = fileName;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    }
  };

  const renderExistingRules = () => <InputColumns />;

  const renderTable = () => {
    return (
      <div id="tableViewer">
        <TableViewer table={resource.primaryKeyTable} />
      </div>
    );
  };

  const renderTabs = () => {
    return (
      <div id="exploration-tabs">
        <div id="column-selection">
          <Tabs
            onChange={(tabId: TabId) => {
              setSelectedTabId(tabId);
            }}
            selectedTabId={selectedTabId}
          >
            <Tab
              id="picker"
              panel={
                <TabColumnPicking
                  attribute={attribute}
                  schema={source.credential.schema}
                  source={source}
                />
              }
              title="Column Selection"
            />
            <Tab id="sql-parser" panel={<TabSQLParser />} title="SQL Parser" />
            <Tab
              id="mb"
              disabled
              panel={<TabColumnSuggestion />}
              title="Column Suggestion"
            />
          </Tabs>
        </div>
        <div>
          <Comments />
        </div>
      </div>
    );
  };

  if (!source?.credential?.schema) {
    toaster.show({
      icon: 'error',
      intent: 'danger',
      message: `missing database schema for source ${source.name}`,
      timeout: 4000
    });
    return (
      <div>
        <Navbar />
      </div>
    );
  }

  return (
    <div>
      <Navbar
        exportMapping={exportMapping}
        exportAdditionalResource={exportAdditionalResource}
      />
      <div id="mapping-explorer-container">
        <div id="main-container">
          <div id="fhir-panel">
            <FhirMappingPanel />
          </div>
          <div id="exploration-panel">
            {attribute && renderExistingRules()}
            {attribute && renderTabs()}
            {source.credential &&
              resource &&
              resource.primaryKeyTable &&
              !attribute &&
              renderTable()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MappingView;
