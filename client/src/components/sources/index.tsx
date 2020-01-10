import {
  Alert,
  Button,
  Card,
  Elevation,
  Icon,
  Intent,
  Spinner,
  Tag
} from '@blueprintjs/core';
import * as QueryString from 'query-string';
import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch } from 'react-redux';
import useReactRouter from 'use-react-router';

import Navbar from '../navbar';

import { changeSelectedSource } from '../../services/selectedNode/actions';

import './style.scss';
import { loader } from 'graphql.macro';

// GRAPHQL
const qSources = loader('src/graphql/queries/sources.graphql');
const mDeleteSource = loader('src/graphql/mutations/deleteSource.graphql');

const SourcesView = () => {
  const dispatch = useDispatch();
  const { history } = useReactRouter();

  const [alertIsOpen, setAlertIsOpen] = React.useState(false);

  const { data: dataSources, loading: loadingSources } = useQuery(qSources, {
    fetchPolicy: 'network-only'
  });

  const removeSourceFromCache = (
    cache: any,
    { data: { deleteSource } }: any
  ) => {
    try {
      const { sources } = cache.readQuery({
        query: qSources
      });

      const newSources = sources.filter((s: any) => s.id !== deleteSource.id);

      cache.writeQuery({
        query: qSources,
        data: { sources: newSources }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [deleteSource, { loading: deletingSource }] = useMutation(
    mDeleteSource,
    { update: removeSourceFromCache }
  );

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
        <div id="software-cards">
          {loadingSources ? (
            <Spinner />
          ) : (
            dataSources.sources.map((source: any, index: number) => {
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
                        source.template.name,
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
                  <h2>
                    {source.template.name} - {source.name}
                    <Button
                      icon={'delete'}
                      loading={deletingSource}
                      minimal={true}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        setAlertIsOpen(true);
                      }}
                    />
                    <Alert
                      cancelButtonText="Cancel"
                      confirmButtonText="Confirm"
                      icon="trash"
                      intent={Intent.DANGER}
                      isOpen={alertIsOpen}
                      canOutsideClickCancel={true}
                      onClose={(confirmed, e) => {
                        setAlertIsOpen(false);
                        if (confirmed) {
                          deleteSource({
                            variables: {
                              id: source.id
                            }
                          });
                        }
                      }}
                    >
                      <p>
                        Etes-vous sûr de vouloir supprimer la source{' '}
                        <b>{source.name}</b>? Cette action n'est pas réversible.
                      </p>
                    </Alert>
                  </h2>
                  <div className="tags">
                    <Tag>DPI</Tag>
                    <Tag>Généraliste</Tag>
                    <Tag>Prescription</Tag>
                  </div>

                  <div>
                    <div className="flexbox">
                      <span>
                        <Icon icon="layout-hierarchy" color="#5C7080" />
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
      </div>
    </div>
  );
};

export default SourcesView;
