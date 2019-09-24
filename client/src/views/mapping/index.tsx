import {
  Button,
  ControlGroup,
  FormGroup,
  Icon,
  InputGroup,
  Spinner,
  Tab,
  Tabs,
  TabId
} from "@blueprintjs/core";
import * as QueryString from "query-string";
import * as React from "react";
import { Mutation, Query, Subscription } from "react-apollo";
import { connect } from "react-redux";

// ACTIONS
import {
  addProfile,
  addResource,
  deleteProfile,
  nodeCollapse,
  nodeExpand,
  updateAddResource
} from "./actions";
import {
  updateFhirAttribute,
  updateFhirResource
} from "../../services/selectedNode/actions";
import { availableResourceNames } from "./reducer";

// COMPONENTS
import ResourceSelect from "../../components/selects/resourceSelect";
import AddResourceSelect from "../../components/selects/addResourceSelect";
import FhirResourceTree from "../../components/fhirResourceTree";
import Navbar from "../../components/navbar";
import InputColumns from "./components/inputColumns";
import ColumnSuggestionTab from "./components/tabs/columnSuggestionTab";
import ColumnPickingTab from "./components/tabs/columnPickingTab";
import SQLRequestParserTab from "./components/tabs/SQLRequestParserTab";

// Import types
import { IReduxStore, IView } from "../../types";

import "./style.less";

// GRAPHQL
const allSources = require("../../graphql/queries/allSources.graphql");
const availableResources = require("../../graphql/queries/availableResources.graphql");
const resourceAttributeTree = require("../../graphql/queries/resourceAttributeTree.graphql");
const createResourceTreeInSource = require("../../graphql/mutations/createResourceTreeInSource.graphql");
const updateResource = require("../../graphql/mutations/updateResource.graphql");

// LOGO
const arkhnLogoWhite = require("../../assets/img/arkhn_logo_only_white.svg") as string;
const arkhnLogoBlack = require("../../assets/img/arkhn_logo_only_black.svg") as string;

export interface IMappingProps {
  createdProfiles: number;
  createdResources: number;
  expandedAttributesIdList: string[];
  selectedAddResource: {
    type: string;
    subtype: string;
    name: string;
  };
}

interface IState {
  columnPicker: {
    owner: string;
    table: string;
    column: string;
    staticValue: string;
  };
  selectedTabId: TabId;
  toggledNavBar: boolean;
}

interface IMappingViewProps extends IView, IMappingProps {}

const mapReduxStateToReactProps = (state: IReduxStore): IMappingViewProps => {
  return {
    ...state.views.mapping,
    data: state.data,
    dispatch: state.dispatch,
    selectedNode: state.selectedNode,
    toaster: state.toaster
  };
};

const reduxify = (
  mapReduxStateToReactProps: any,
  mapDispatchToProps?: any,
  mergeProps?: any,
  options?: any
): any => {
  return (target: any) =>
    connect(
      mapReduxStateToReactProps,
      mapDispatchToProps,
      mergeProps,
      options
    )(target) as any;
};

@reduxify(mapReduxStateToReactProps)
export default class MappingView extends React.Component<
  IMappingViewProps,
  IState
> {
  constructor(props: IMappingViewProps) {
    super(props);

    this.state = {
      columnPicker: {
        owner: null,
        table: null,
        column: null,
        staticValue: ""
      },
      selectedTabId: "picker",
      toggledNavBar: false
    };
  }

  /*
    This function updates the current url with new information.
    Before: url/pathname?attr1=value1
    After: url/pathname?attr1=value1&key=value
  */
  private updateLocationSearch = (key: string, value: string) => {
    const qs = QueryString.stringify({
      ...QueryString.parse(this.props.location.search),
      [key]: value
    });

    this.props.history.push({ search: qs });
  };

  public render = () => {
    const {
      createdProfiles,
      createdResources,
      data,
      dispatch,
      selectedAddResource,
      selectedNode
    } = this.props;

    const { columnPicker, selectedTabId, toggledNavBar } = this.state;

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
                    ? this.props.data.sourceSchemas.schemaBySourceName[
                        selectedNode.source.name
                      ]
                    : {}
                }
                source={selectedNode.source}
              />
              <div id="column-selection">
                <Tabs
                  onChange={(tabId: TabId) => {
                    this.setState({ selectedTabId: tabId });
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
                            ? this.props.data.sourceSchemas.schemaBySourceName[
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
            <Query
              fetchPolicy={"network-only"}
              query={availableResources}
              skip={!selectedNode.source.id}
              variables={{
                sourceId: selectedNode.source.id,
                // This allows to force refetch
                // when a new resource is added.
                createdResources: createdResources
              }}
            >
              {({ data, loading }: any) => {
                return (
                  <div id="fhir-panel">
                    <div id="fhir-attributes">
                      <div id="resource-selector">
                        <FormGroup>
                          <ControlGroup>
                            <ResourceSelect
                              disabled={!selectedNode.source}
                              icon={"layout-hierarchy"}
                              inputItem={selectedNode.resource}
                              intent={"primary"}
                              items={
                                data && data.availableResources
                                  ? data.availableResources
                                  : []
                              }
                              loading={loading}
                              onChange={(resource: any) => {
                                dispatch(
                                  updateFhirResource(
                                    resource.id,
                                    resource.fhirType,
                                    resource.label
                                  )
                                );
                                this.updateLocationSearch(
                                  "resourceId",
                                  resource.id
                                );
                              }}
                            />
                            <Mutation mutation={updateResource}>
                              {(
                                updateResourcelabel: any,
                                { data, loading }: any
                              ) => {
                                const value = selectedNode.resource.label || "";

                                return (
                                  <InputGroup
                                    onChange={(
                                      event: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                      const newValue = event.target.value;
                                      dispatch(
                                        updateFhirResource(
                                          selectedNode.resource.id,
                                          selectedNode.resource.fhirType,
                                          newValue
                                        )
                                      );
                                    }}
                                    onKeyPress={event => {
                                      if (event.key === "Enter") {
                                        updateResourcelabel({
                                          variables: {
                                            where: {
                                              id: selectedNode.resource.id
                                            },
                                            data: {
                                              label: value
                                            }
                                          }
                                        });
                                      }
                                    }}
                                    type="text"
                                    placeholder="Name..."
                                    value={value}
                                    rightElement={
                                      loading ? (
                                        <Spinner size={15} />
                                      ) : data ? (
                                        <Icon
                                          icon="small-tick"
                                          intent="primary"
                                        />
                                      ) : null
                                    }
                                  />
                                );
                              }}
                            </Mutation>
                            <Button icon={"trash"} intent="danger" />
                          </ControlGroup>
                        </FormGroup>
                      </div>
                      <div id="fhir-resource-tree">
                        {selectedNode.resource.fhirType ? (
                          <Query
                            fetchPolicy={"network-only"}
                            query={resourceAttributeTree}
                            variables={{
                              createdProfiles: createdProfiles,
                              resourceId: selectedNode.resource.id
                            }}
                            skip={
                              !selectedNode.source || !selectedNode.resource.id
                            }
                          >
                            {({ data, loading }: any) => {
                              return loading ? (
                                <Spinner />
                              ) : (
                                <FhirResourceTree
                                  addProfileCallback={(response: any) => {
                                    dispatch(addProfile());
                                  }}
                                  deleteProfileCallback={(response: any) => {
                                    dispatch(deleteProfile());
                                  }}
                                  expandedAttributesIdList={
                                    this.props.expandedAttributesIdList
                                  }
                                  nodeCollapseCallback={(node: any) =>
                                    dispatch(nodeCollapse(node))
                                  }
                                  nodeExpandCallback={(node: any) =>
                                    dispatch(nodeExpand(node))
                                  }
                                  json={data.resource.attributes}
                                  onClickCallback={(nodeData: any) => {
                                    dispatch(
                                      updateFhirAttribute(
                                        nodeData.id,
                                        nodeData.name
                                      )
                                    );
                                    this.updateLocationSearch(
                                      "attributeId",
                                      nodeData.id
                                    );
                                  }}
                                  selectedNodeId={selectedNode.attribute.id}
                                />
                              );
                            }}
                          </Query>
                        ) : null}
                      </div>
                    </div>
                    <div id="resource-add">
                      <FormGroup label={"Add Resource"}>
                        <ControlGroup>
                          <AddResourceSelect
                            disabled={!selectedNode.source}
                            intent={null}
                            inputItem={selectedAddResource}
                            items={availableResourceNames}
                            onChange={(resource: any) => {
                              dispatch(updateAddResource(resource));
                            }}
                          />
                          <Mutation
                            mutation={createResourceTreeInSource}
                            onCompleted={(data: any) => {
                              this.props.toaster.show({
                                icon: "layout-hierarchy",
                                intent: "success",
                                message: `Ressource ${
                                  data.createResourceTreeInSource.fhirType
                                } créée pour ${selectedNode.source.name}.`,
                                timeout: 4000
                              });

                              dispatch(addResource());
                            }}
                            onError={(error: any) => {
                              this.props.toaster.show({
                                icon: "error",
                                intent: "danger",
                                message: error.message,
                                timeout: 4000
                              });
                            }}
                          >
                            {(createResource: any, { data, loading }: any) => {
                              return (
                                <Button
                                  loading={loading}
                                  icon={"plus"}
                                  onClick={() => {
                                    createResource({
                                      variables: {
                                        sourceId: selectedNode.source.id,
                                        resourceName: selectedAddResource.name
                                      }
                                    });
                                  }}
                                />
                              );
                            }}
                          </Mutation>
                        </ControlGroup>
                      </FormGroup>
                    </div>
                  </div>
                );
              }}
            </Query>
          </div>
        </div>
      </div>
    );
  };
}
