import { Tab, Tabs, TabId, Icon } from '@blueprintjs/core';
import * as React from 'react';
import { useSelector } from 'react-redux';

import Navbar from '../navbar';
import InputColumns from './InputColumns';
import TabColumnSuggestion from './TabColumnSuggestion';
import TabColumnPicking from './TabColumnPicking';
import TabSQLParser from './TabSQLParser';
import Comments from './Comments';
import FhirMappingPanel from './FhirMappingPanel';

// Import types
import { IReduxStore } from '../../types';

import './style.scss';

const MappingView = () => {
  const data = useSelector((state: IReduxStore) => state.data);
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const [selectedTabId, setSelectedTabId] = React.useState('picker' as TabId);

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

  return (
    <div>
      <Navbar />
      <div id="mapping-explorer-container">
        <div id="main-container">
          <div id="exploration-panel">
            {selectedNode.attribute.id && renderExistingRules()}
            {selectedNode.attribute.id ? renderTabs() : renderHelp()}
          </div>
          <div id="fhir-panel">
            {selectedNode.source.id && <FhirMappingPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MappingView;
