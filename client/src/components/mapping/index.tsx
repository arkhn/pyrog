import * as React from 'react';
import { Tab, Tabs, TabId, Icon } from '@blueprintjs/core';
import { loader } from 'graphql.macro';
import { useApolloClient } from 'react-apollo';
import { useSelector } from 'react-redux';

import Navbar from 'components/navbar';
import InputColumns from './InputColumns';
import TabColumnSuggestion from './TabColumnSuggestion';
import TabColumnPicking from './TabColumnPicking';
import TabSQLParser from './TabSQLParser';
import Comments from './Comments';
import FhirMappingPanel from './FhirMappingPanel';

// Import types
import { IReduxStore } from 'types';

import './style.scss';

const qExportMapping = loader('src/graphql/queries/exportMapping.graphql');

const MappingView = () => {
  const data = useSelector((state: IReduxStore) => state.data);
  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const [selectedTabId, setSelectedTabId] = React.useState('picker' as TabId);
  const client = useApolloClient();

  const exportMapping = async () => {
    const { data, errors } = await client.query({
      query: qExportMapping,
      variables: {
        sourceId: selectedNode.source.id
      },
      fetchPolicy: 'network-only'
    });

    if (errors && errors.length) {
      toaster.show({
        icon: 'error',
        intent: 'danger',
        message: `error while exporting mapping`,
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

  const renderExistingRules = () => (
    <InputColumns
      selectedAttribute={selectedNode.attribute}
      schema={
        selectedNode.source.schemaFileName
          ? data.sourceSchemas.schemaByFileName[
              selectedNode.source.schemaFileName
            ]
          : {}
      }
      source={selectedNode.source}
    />
  );

  const renderTabs = () => {
    return (
      <div>
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
                  attribute={selectedNode.attribute}
                  schema={
                    selectedNode.source.schemaFileName
                      ? data.sourceSchemas.schemaByFileName[
                          selectedNode.source.schemaFileName
                        ]
                      : {}
                  }
                  source={selectedNode.source}
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

  const renderHelp = () => {
    return (
      <div id="help-resource">
        {!selectedNode.resource.id && (
          <div id="help-pick-resource">
            <p>Pick a resource</p>
            <Icon icon="arrow-right" />
          </div>
        )}
        {!selectedNode.resource.id && (
          <div id="help-add-resource">
            <p>Add a resource</p>
            <Icon icon="arrow-right" />
          </div>
        )}
        {selectedNode.resource.id && !selectedNode.attribute.id && (
          <div id="help-pick-attribute">
            <p>Pick an attribute</p>
            <Icon icon="arrow-right" />
          </div>
        )}
      </div>
    );
  };

  if (
    selectedNode.source.schemaFileName &&
    !data.sourceSchemas.schemaByFileName[selectedNode.source.schemaFileName]
  ) {
    toaster.show({
      icon: 'error',
      intent: 'danger',
      message: `missing database schema for source ${selectedNode.source.name}`,
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
      <Navbar exportMapping={exportMapping} />
      <div id="mapping-explorer-container">
        <div id="main-container">
          <div id="exploration-panel">
            {selectedNode.attribute.id && renderExistingRules()}
            {selectedNode.attribute.id ? renderTabs() : renderHelp()}
          </div>
          <div id="fhir-panel">
            <FhirMappingPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MappingView;
