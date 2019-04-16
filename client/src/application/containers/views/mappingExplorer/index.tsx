import {
  Alignment,
  Breadcrumbs,
  IBreadcrumbProps,
  Button,
  Card,
  Code,
  ControlGroup,
  Elevation,
  FormGroup,
  InputGroup,
  MenuItem,
  NonIdealState,
  OverflowList,
  Spinner,
  Tab,
  Tabs,
  TabId,
  Tag
} from "@blueprintjs/core";
import * as QueryString from "query-string";
import * as React from "react";
import { Mutation, Query, Subscription } from "react-apollo";
import { connect } from "react-redux";

// Import actions
import {
  addProfile,
  addResource,
  deleteProfile,
  nodeCollapse,
  nodeExpand,
  updateAddResource,
  updateFhirAttribute,
  updateFhirResource
} from "./actions";
import { availableResourceNames } from "./reducer";

// Import components
import ColumnPicker from "../../../components/columnPicker";
import InputColumnsTable from "../../../components/inputColumnsTable";
import StringSelect from "../../../components/selects/stringSelect";
import TSelect from "../../../components/selects/TSelect";
import SourceSelect from "../../../components/selects/sourceSelect";
import ResourceSelect from "../../../components/selects/resourceSelect";
import AddResourceSelect from "../../../components/selects/addResourceSelect";
// Import containers
import FhirResourceTree from "../../utils/fhirResourceTree";
import Navbar from "../../utils/navbar";

// Import types
import { IReduxStore, IView } from "../../../types";

import "./style.less";

// GRAPHQL OPERATIONS

// Queries
const allSources = require("../../graphql/queries/allSources.graphql");
const availableResources = require("../../graphql/queries/availableResources.graphql");
const inputColumns = require("../../graphql/queries/inputColumns.graphql");
const resourceAttributeTree = require("../../graphql/queries/resourceAttributeTree.graphql");

// Mutations
const createInputColumnAndUpdateAttribute = require("../../graphql/mutations/createInputColumnAndUpdateAttribute.graphql");
const deleteInputColumnAndUpdateAttribute = require("../../graphql/mutations/deleteInputColumnAndUpdateAttribute.graphql");
const updateInputColumn = require("../../graphql/mutations/updateInputColumn.graphql");

const createJoinAndUpdateInputColumn = require("../../graphql/mutations/createJoinAndUpdateInputColumn.graphql");
const deleteJoinAndUpdateInputColumn = require("../../graphql/mutations/deleteJoinAndUpdateInputColumn.graphql");
const updateJoin = require("../../graphql/mutations/updateJoin.graphql");

const updateAttribute = require("../../graphql/mutations/updateAttribute.graphql");
const createResourceTreeInSource = require("../../graphql/mutations/createResourceTreeInSource.graphql");

// Subscriptions
const subscribeAttribute = require("../../graphql/subscriptions/attribute.graphql");
const subscribeInputColumn = require("../../graphql/subscriptions/inputColumn.graphql");
const subscribeJoin = require("../../graphql/subscriptions/join.graphql");

// LOGO
const arkhnLogoWhite = require("../../../../assets/img/arkhn_logo_only_white.svg") as string;
const arkhnLogoBlack = require("../../../../assets/img/arkhn_logo_only_black.svg") as string;

export interface IMappingExplorerState {
  createdProfiles: number;
  createdResources: number;
  expandedAttributesIdList: string[];
  selectedAddResource: {
    type: string;
    subtype: string;
    name: string;
  };
  selectedFhirResource: {
    id: string;
    name: string;
  };
  selectedFhirAttribute: {
    id: string;
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

interface IMappingExplorerViewState extends IView, IMappingExplorerState {}

const mapReduxStateToReactProps = (
  state: IReduxStore
): IMappingExplorerViewState => {
  return {
    ...state.views.mappingExplorer,
    data: state.data,
    dispatch: state.dispatch,
    selectedSource: state.selectedSource,
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
export default class MappingExplorerView extends React.Component<
  IMappingExplorerViewState,
  IState
> {
  constructor(props: IMappingExplorerViewState) {
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
      selectedSource,
      selectedFhirResource,
      selectedFhirAttribute
    } = this.props;

    const { columnPicker, selectedTabId, toggledNavBar } = this.state;

    const inputColumnComponent = (attribute: any, column: any) => (
      <div className="input-column">
        <Mutation mutation={deleteInputColumnAndUpdateAttribute}>
          {(deleteInputColumn, { data, loading, error }) => {
            return (
              <Button
                icon={"trash"}
                loading={loading}
                minimal={true}
                onClick={() => {
                  deleteInputColumn({
                    variables: {
                      attributeId: selectedFhirAttribute.id,
                      inputColumnId: column.id
                    }
                  });
                }}
              />
            );
          }}
        </Mutation>
        <Card elevation={Elevation.ONE} className="input-column-info">
          {column.staticValue ? (
            <div className="input-column-name">
              <Tag large={true}>Static</Tag>
              <Tag intent={"success"} large={true} minimal={true}>
                {column.staticValue}
              </Tag>
            </div>
          ) : (
            <div>
              <div className="input-column-name">
                <Breadcrumbs
                  breadcrumbRenderer={(item: IBreadcrumbProps) => {
                    return <div>{item.text}</div>;
                  }}
                  items={[
                    {
                      text: (
                        <div className="stacked-tags">
                          <Tag minimal={true}>OWNER</Tag>
                          <Tag intent={"success"} large={true}>
                            {column.owner}
                          </Tag>
                        </div>
                      )
                    },
                    {
                      text: (
                        <div className="stacked-tags">
                          <Tag minimal={true}>TABLE</Tag>
                          <Tag intent={"success"} large={true}>
                            {column.table}
                          </Tag>
                        </div>
                      )
                    },
                    {
                      text: (
                        <div className="stacked-tags">
                          <Tag minimal={true}>COLUMN</Tag>
                          <Tag intent={"success"} large={true}>
                            {column.column}
                          </Tag>
                        </div>
                      )
                    }
                  ]}
                />
                <Mutation mutation={updateInputColumn}>
                  {(updateInputColumn, { data, loading }) => {
                    return (
                      <div className="stacked-tags">
                        <Tag>SCRIPT</Tag>
                        <StringSelect
                          disabled={true}
                          inputItem={column.script}
                          items={["script1.py", "script2.py"]}
                          loading={loading}
                          onChange={(e: string) => {
                            updateInputColumn({
                              variables: {
                                id: column.id,
                                data: {
                                  script: e
                                }
                              }
                            });
                          }}
                        />
                      </div>
                    );
                  }}
                </Mutation>
              </div>
              <div className="input-column-joins">
                <Mutation mutation={createJoinAndUpdateInputColumn}>
                  {(createJoin, { data, loading }) => {
                    return (
                      <Button
                        icon={"add"}
                        loading={loading}
                        onClick={() => {
                          createJoin({
                            variables: {
                              inputColumnId: column.id,
                              data: {}
                            }
                          });
                        }}
                      >
                        Add Join
                      </Button>
                    );
                  }}
                </Mutation>
                {column.joins
                  ? column.joins.map((join: any, index: number) => {
                      let joinData = join;
                      return (
                        <Subscription
                          key={index}
                          subscription={subscribeJoin}
                          variables={{
                            id: join.id
                          }}
                        >
                          {({ data, loading }) => {
                            joinData =
                              data && data.join && data.join.node
                                ? data.join.node
                                : joinData;

                            return joinData
                              ? joinComponent(joinData, column)
                              : null;
                          }}
                        </Subscription>
                      );
                    })
                  : null}
              </div>
            </div>
          )}
        </Card>
      </div>
    );

    const joinColumnsComponent = (join: any, updateJoin: any) => (
      <div className="join-columns">
        <ColumnPicker
          ownerChangeCallback={(e: string) => {
            updateJoin({
              variables: {
                id: join.id,
                data: {
                  sourceOwner: e,
                  sourceTable: null,
                  sourceColumn: null
                }
              }
            });
          }}
          tableChangeCallback={(e: string) => {
            updateJoin({
              variables: {
                id: join.id,
                data: {
                  sourceTable: e,
                  sourceColumn: null
                }
              }
            });
          }}
          columnChangeCallback={(e: string) => {
            updateJoin({
              variables: {
                id: join.id,
                data: {
                  sourceColumn: e
                }
              }
            });
          }}
          initialColumn={{
            owner: join.sourceOwner,
            table: join.sourceTable,
            column: join.sourceColumn
          }}
          sourceSchema={
            selectedSource.name
              ? this.props.data.sourceSchemas.schemaBySourceName[
                  selectedSource.name
                ]
              : {}
          }
        />
        <ColumnPicker
          ownerChangeCallback={(e: string) => {
            updateJoin({
              variables: {
                id: join.id,
                data: {
                  targetOwner: e,
                  targetTable: null,
                  targetColumn: null
                }
              }
            });
          }}
          tableChangeCallback={(e: string) => {
            updateJoin({
              variables: {
                id: join.id,
                data: {
                  targetTable: e,
                  targetColumn: null
                }
              }
            });
          }}
          columnChangeCallback={(e: string) => {
            updateJoin({
              variables: {
                id: join.id,
                data: {
                  targetColumn: e
                }
              }
            });
          }}
          initialColumn={{
            owner: join.targetOwner,
            table: join.targetTable,
            column: join.targetColumn
          }}
          sourceSchema={
            selectedSource.name
              ? this.props.data.sourceSchemas.schemaBySourceName[
                  selectedSource.name
                ]
              : {}
          }
        />
      </div>
    );

    const joinComponent = (joinData: any, column: any) => (
      <div className={"join"}>
        <Mutation mutation={deleteJoinAndUpdateInputColumn}>
          {(deleteJoin, { data, loading }) => {
            return (
              <Button
                icon={"trash"}
                minimal={true}
                loading={loading}
                onClick={() => {
                  deleteJoin({
                    variables: {
                      inputColumnId: column.id,
                      joinId: joinData.id
                    }
                  });
                }}
              />
            );
          }}
        </Mutation>
        <Mutation mutation={updateJoin}>
          {(updateJoin, { data, loading }) => {
            return joinColumnsComponent(joinData, updateJoin);
          }}
        </Mutation>
      </div>
    );

    const inputColumnsComponent = (
      <Query
        query={inputColumns}
        variables={{ attributeId: selectedFhirAttribute.id }}
        skip={!selectedFhirAttribute.id}
      >
        {({ data, loading }) => {
          if (loading) {
            return <Spinner />;
          }
          let inputColumns = data && data.inputColumns ? data.inputColumns : [];

          return selectedFhirAttribute.id ? (
            <Subscription
              subscription={subscribeAttribute}
              variables={{
                id: selectedFhirAttribute.id
              }}
            >
              {({ data, loading, error }) => {
                const attribute =
                  data && data.attribute && data.attribute.node
                    ? data.attribute.node
                    : null;

                inputColumns =
                  attribute && attribute.inputColumns
                    ? attribute.inputColumns
                    : inputColumns;

                return (
                  <div id="input-columns">
                    <div id="input-column-rows">
                      {inputColumns.map((inputColumn: any, index: number) => {
                        return (
                          <Subscription
                            key={index}
                            subscription={subscribeInputColumn}
                            variables={{
                              id: inputColumn.id
                            }}
                          >
                            {({ data, loading }) => {
                              const column =
                                data &&
                                data.inputColumn &&
                                data.inputColumn.node
                                  ? data.inputColumn.node
                                  : inputColumn;

                              return column
                                ? inputColumnComponent(
                                    selectedFhirAttribute,
                                    column
                                  )
                                : null;
                            }}
                          </Subscription>
                        );
                      })}
                    </div>
                    {inputColumns.length > 1 ? (
                      <div id="input-column-merging-script">
                        <Mutation mutation={updateAttribute}>
                          {(updateAttribute, { data, loading }) => {
                            return (
                              <div className="stacked-tags">
                                <Tag>SCRIPT</Tag>
                                <StringSelect
                                  disabled={true}
                                  inputItem={
                                    attribute && attribute.mergingScript
                                      ? attribute.mergingScript
                                      : ""
                                  }
                                  items={["mergingScript.py"]}
                                  loading={loading}
                                  onChange={(e: string) => {
                                    updateAttribute({
                                      variables: {
                                        id: attribute.id,
                                        data: {
                                          mergingScript: e
                                        }
                                      }
                                    });
                                  }}
                                />
                              </div>
                            );
                          }}
                        </Mutation>
                      </div>
                    ) : null}
                  </div>
                );
              }}
            </Subscription>
          ) : null;
        }}
      </Query>
    );

    const columnPickingTab = (
      <div id={"column-picker"}>
        <Card elevation={Elevation.ONE}>
          <FormGroup
            label={<h3>Column Picker</h3>}
            labelFor="text-input"
            inline={true}
          >
            <ControlGroup>
              <ColumnPicker
                ownerChangeCallback={(e: string) => {
                  this.setState({
                    columnPicker: {
                      ...this.state.columnPicker,
                      owner: e,
                      table: null,
                      column: null
                    }
                  });
                }}
                tableChangeCallback={(e: string) => {
                  this.setState({
                    columnPicker: {
                      ...this.state.columnPicker,
                      table: e,
                      column: null
                    }
                  });
                }}
                columnChangeCallback={(e: string) => {
                  this.setState({
                    columnPicker: {
                      ...this.state.columnPicker,
                      column: e
                    }
                  });
                }}
                sourceSchema={
                  selectedSource.name
                    ? data.sourceSchemas.schemaBySourceName[selectedSource.name]
                    : {}
                }
              />
              <Mutation mutation={createInputColumnAndUpdateAttribute}>
                {(createInputColumnAndUpdateAttribute, { data, loading }) => {
                  return (
                    <Button
                      disabled={!columnPicker.column || !selectedFhirAttribute}
                      icon={"add"}
                      loading={loading}
                      onClick={() =>
                        createInputColumnAndUpdateAttribute({
                          variables: {
                            attributeId: selectedFhirAttribute.id,
                            data: {
                              owner: columnPicker.owner,
                              table: columnPicker.table,
                              column: columnPicker.column
                            }
                          }
                        })
                      }
                    />
                  );
                }}
              </Mutation>
            </ControlGroup>
          </FormGroup>
        </Card>
        <Card elevation={Elevation.ONE}>
          <FormGroup
            label={<h3>Column With Static Value</h3>}
            labelFor="text-input"
            inline={true}
          >
            <ControlGroup>
              <InputGroup
                id="static-value-input"
                onChange={(event: React.FormEvent<HTMLElement>) => {
                  const target = event.target as HTMLInputElement;

                  this.setState({
                    columnPicker: {
                      ...this.state.columnPicker,
                      staticValue: target.value
                    }
                  });
                }}
                placeholder="Column static value"
                value={columnPicker.staticValue}
              />
              <Mutation mutation={createInputColumnAndUpdateAttribute}>
                {(createInputColumn, { data, loading }) => {
                  return (
                    <Button
                      disabled={columnPicker.staticValue.length == 0}
                      icon={"add"}
                      loading={loading}
                      onClick={() =>
                        createInputColumn({
                          variables: {
                            attributeId: selectedFhirAttribute.id,
                            data: {
                              staticValue: columnPicker.staticValue
                            }
                          }
                        })
                      }
                    />
                  );
                }}
              </Mutation>
            </ControlGroup>
          </FormGroup>
        </Card>
      </div>
    );

    const columnSuggestionTab = <div>Suggestions</div>;

    const columnSelectionComponent = (
      <div id="column-selection">
        <Tabs
          onChange={(tabId: TabId) => {
            this.setState({
              selectedTabId: tabId
            });
          }}
          selectedTabId={selectedTabId}
        >
          <Tab id="picker" title="Simple Tools" panel={columnPickingTab} />
          <Tab
            id="mb"
            disabled
            title="Column Suggestion Tool"
            panel={columnSuggestionTab}
          />
        </Tabs>
      </div>
    );

    const fhirResourceTree = (
      <Query
        fetchPolicy={"network-only"}
        query={resourceAttributeTree}
        variables={{
          createdProfiles: createdProfiles,
          resourceId: selectedFhirResource.id
        }}
        skip={!selectedSource || !selectedFhirResource.id}
      >
        {({ data, loading }) => {
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
              expandedAttributesIdList={this.props.expandedAttributesIdList}
              nodeCollapseCallback={(node: any) => dispatch(nodeCollapse(node))}
              nodeExpandCallback={(node: any) => dispatch(nodeExpand(node))}
              json={data.resource.attributes}
              onClickCallback={(nodeData: any) => {
                dispatch(updateFhirAttribute(nodeData.id, nodeData.name));
                this.updateLocationSearch("attributeId", nodeData.id);
              }}
              selectedNodeId={selectedFhirAttribute.id}
            />
          );
        }}
      </Query>
    );

    return (
      <div>
        <Navbar />
        <div id="mapping-explorer-container">
          <div id="main-container">
            <Query
              fetchPolicy={"network-only"}
              query={availableResources}
              skip={!selectedSource.id}
              variables={{
                sourceId: selectedSource.id,
                // This allows to force refetch
                // when a new resource is added.
                createdResources: createdResources
              }}
            >
              {({ data, loading }) => {
                return (
                  <div id="left-part">
                    <div id="fhir-attributes">
                      <div id="resource-selector">
                        <ResourceSelect
                          disabled={!selectedSource}
                          icon={"layout-hierarchy"}
                          inputItem={selectedFhirResource}
                          intent={"primary"}
                          items={
                            data && data.availableResources
                              ? data.availableResources
                              : []
                          }
                          loading={loading}
                          onChange={(resource: any) => {
                            dispatch(
                              updateFhirResource(resource.id, resource.name)
                            );
                            this.updateLocationSearch(
                              "resourceId",
                              resource.id
                            );
                          }}
                        />
                      </div>
                      <div id="fhir-resource-tree">
                        {selectedFhirResource.name ? fhirResourceTree : null}
                      </div>
                    </div>
                    <div id="resource-add">
                      <FormGroup label={"Add Resource"}>
                        <ControlGroup>
                          <AddResourceSelect
                            disabled={!selectedSource}
                            intent={null}
                            inputItem={selectedAddResource}
                            items={availableResourceNames.filter(
                              (resource: any) => {
                                return (
                                  data &&
                                  data.availableResources &&
                                  data.availableResources
                                    .map((resource: any) => resource.name)
                                    .indexOf(resource.name) < 0
                                );
                              }
                            )}
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
                                  data.createResourceTreeInSource.name
                                } créée pour ${selectedSource.name}.`,
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
                            {(createResource, { data, loading }) => {
                              return (
                                <Button
                                  loading={loading}
                                  icon={"plus"}
                                  onClick={() => {
                                    createResource({
                                      variables: {
                                        sourceId: selectedSource.id,
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
            <div id="right-part">
              {inputColumnsComponent}
              {columnSelectionComponent}
            </div>
          </div>
        </div>
      </div>
    );
  };
}
