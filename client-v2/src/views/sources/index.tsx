import { Button, Card, Elevation, Icon, Spinner, Tag } from '@blueprintjs/core';
import * as QueryString from 'query-string';
import * as React from 'react';
import { useMutation } from "@apollo/react-hooks";
import { Query } from 'react-apollo';
import { useDispatch } from "react-redux";
import useReactRouter from "use-react-router";

import Navbar from '../../components/Navbar';

import { changeSelectedSource } from '../../services/selectedNode/actions';

import './style.less';

// GRAPHQL
const qSources = require('src/graphql/queries/sources.graphql');
const mDeleteSource = require('src/graphql/mutations/deleteSource.graphql');

const SourcesView = () => {
  const dispatch = useDispatch();
  const { history } = useReactRouter();

  const removeSourceFromCache = (
    cache: any, { data: { deleteSource } }: any
  ) => {
    try {
      const { sources } = cache.readQuery({
        query: qSources,
      });

      const newSources = sources.filter((s: any) => s.id !== deleteSource.id)

      cache.writeQuery({
        query: qSources,
        data: { sources: newSources }
      });
    } catch (error) {
      console.log(error)
    }
  }

  const [
    deleteSource,
    { loading: deletingSource }
  ] = useMutation(mDeleteSource, { update: removeSourceFromCache });

  return (
    <div>
      <Navbar />
      <div id="main-container-softwares">
        <Button
          icon={'add'}
          intent={'primary'}
          large={true}
          onClick={() => {
            history.push('/newSource');
          }}
        >
          Ajouter une source / un logiciel
        </Button>
        <Query fetchPolicy="network-only" query={qSources}>
          {({ data, loading }: any) => {
            return (
              <div id="software-cards">
                {loading ? (
                  <Spinner />
                ) : (
                    data.sources.map((source: any, index: number) => {
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
                            history.push({
                              pathname: '/mapping',
                              search: QueryString.stringify({
                                sourceId: source.id
                              })
                            });
                          }}
                        >
                          <h2>{source.name}
                            <Button
                              icon={"delete"}
                              loading={deletingSource}
                              minimal={true}
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation()
                                deleteSource({
                                  variables: {
                                    id: source.id
                                  }
                                });
                                console.log(`Removing {source.name}`)
                              }} />
                          </h2>
                          <div className="tags">
                            <Tag>DPI</Tag>
                            <Tag>Généraliste</Tag>
                            <Tag>Prescription</Tag>
                          </div>

                          <div>
                            <div className="flexbox">
                              <span>
                                <Icon
                                  icon="layout-hierarchy"
                                  color="#5C7080"
                                />
                                <span>{source.mappingProgress[0]} Ressources</span>
                              </span>
                              <span>
                                <Icon icon="tag" color="#5C7080" />
                                <span>{source.mappingProgress[1]} Attributs</span>
                              </span>
                            </div>
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
}

export default SourcesView;