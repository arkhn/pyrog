import { Tab, Tabs, TabId } from "@blueprintjs/core";
import * as React from "react";
import { useSelector } from "react-redux";

import Navbar from "../../components/Navbar";
import InputColumns from "./components/inputColumns";
import ColumnSuggestionTab from "./components/tabs/columnSuggestionTab";
import ColumnPickingTab from "./components/tabs/columnPickingTab";
import SQLRequestParserTab from "./components/tabs/SQLRequestParserTab";
import FhirMappingPanel from "./components/FhirMappingPanel";

// Import types
import { IReduxStore } from "../../types";

import "./style.less";

const MappingView = () => {
  const data = useSelector((state: IReduxStore) => state.data);
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const [selectedTabId, setSelectedTabId] = React.useState("picker" as TabId);

  return (
    <div>
      <Navbar />
      <div id="mapping-explorer-container">
        <div id="main-container">
          <div id="exploration-panel">
            <InputColumns
              selectedAttribute={selectedNode.attribute}
              schema={
                selectedNode.source.name
                  ? data.sourceSchemas.schemaBySourceName[
                      selectedNode.source.name
                    ]
                  : {}
              }
              source={selectedNode.source}
            />
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
                    <ColumnPickingTab
                      attribute={selectedNode.attribute}
                      schema={
                        selectedNode.source.name
                          ? data.sourceSchemas.schemaBySourceName[
                              selectedNode.source.name
                            ]
                          : {}
                      }
                      source={selectedNode.source}
                    />
                  }
                  title="Simple Tools"
                />
                <Tab
                  id="sql-parser"
                  panel={<SQLRequestParserTab />}
                  title="SQL Parser Tool"
                />
                <Tab
                  id="mb"
                  disabled
                  panel={<ColumnSuggestionTab />}
                  title="Column Suggestion Tool"
                />
              </Tabs>
            </div>
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
