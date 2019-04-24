import { Button, Card, Elevation, Icon, Spinner, Tag } from "@blueprintjs/core";
import * as QueryString from "query-string";
import * as React from "react";
import { Mutation, Query, Subscription } from "react-apollo";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Navbar from "../../components/navbar";

import { changeSelectedSource } from "../../services//selectedSource/actions";

// Import types
import { IReduxStore, IView } from "../../types";

import "./style.less";

// GRAPHQL OPERATIONS

// Queries
const allSources = require("../../graphql/queries/allSources.graphql");
const computeSourceMappingProgress = require("../../graphql/queries/computeSourceMappingProgress.graphql");

export interface ISourcesState {}

interface IState {}

interface ISourcesViewState extends IView, ISourcesState {}

const mapReduxStateToReactProps = (state: IReduxStore): ISourcesViewState => {
  return {
    data: state.data,
    dispatch: state.dispatch
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

class SourcesView extends React.Component<ISourcesViewState, IState> {
  constructor(props: ISourcesViewState) {
    super(props);
  }

  public render = () => {
    const { data, dispatch } = this.props;

    return (
      <div>
        <Navbar />
        <div id="main-container-softwares">
          <Button
            icon={"add"}
            intent={"primary"}
            large={true}
            onClick={() => {
              this.props.history.push("/newSource");
            }}
          >
            Ajouter une source / un logiciel
          </Button>
          <Query fetchPolicy="network-only" query={allSources}>
            {({ data, loading }: any) => {
              return (
                <div id="software-cards">
                  {loading ? (
                    <Spinner />
                  ) : (
                    data.allSources.map((source: any, index: number) => {
                      return (
                        <Card
                          elevation={Elevation.TWO}
                          interactive={true}
                          key={index}
                          onClick={() => {
                            dispatch(
                              changeSelectedSource(
                                source.id,
                                source.name,
                                source.hasOwner
                              )
                            );
                            this.props.history.push({
                              pathname: "/mapping",
                              search: QueryString.stringify({
                                sourceId: source.id
                              })
                            });
                          }}
                        >
                          <h2>{source.name}</h2>
                          <div className="tags">
                            <Tag>DPI</Tag>
                            <Tag>Généraliste</Tag>
                            <Tag>Prescription</Tag>
                          </div>

                          <div>
                            <Query
                              query={computeSourceMappingProgress}
                              variables={{
                                sourceId: source.id
                              }}
                              skip={!source.id}
                            >
                              {({ data, loading }: any) => {
                                let numberResources = null;
                                let numberAttributes = null;

                                if (data && data.computeSourceMappingProgress) {
                                  numberResources =
                                    data.computeSourceMappingProgress[0];
                                  numberAttributes =
                                    data.computeSourceMappingProgress[1];
                                }

                                return loading ? (
                                  <Spinner size={15} />
                                ) : (
                                  <div className="flexbox">
                                    <span>
                                      <Icon
                                        icon="layout-hierarchy"
                                        color="#5C7080"
                                      />
                                      <span>{numberResources} Ressources</span>
                                    </span>
                                    <span>
                                      <Icon icon="tag" color="#5C7080" />
                                      <span>{numberAttributes} Attributs</span>
                                    </span>
                                  </div>
                                );
                              }}
                            </Query>
                          </div>
                        </Card>
                      );
                    })
                  )}
                </div>
              );
            }}
          </Query>
        </div>
      </div>
    );
  };
}

export default withRouter(connect(mapReduxStateToReactProps)(
  SourcesView
) as any);
