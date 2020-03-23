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
import React, { ReactElement } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useQuery } from '@apollo/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import useReactRouter from 'use-react-router';
import { loader } from 'graphql.macro';

import Navbar from 'components/navbar';

import { changeSelectedSource } from 'services/selectedNode/actions';
import { HTTP_BACKEND_URL } from '../../constants';
import { IReduxStore } from 'types';

import './style.scss';

interface Source {
  name: string;
  id: string;
}

// GRAPHQL
const qSources = loader('src/graphql/queries/sourcesForUser.graphql');
const mDeleteSource = loader('src/graphql/mutations/deleteSource.graphql');

const SourcesView = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { history } = useReactRouter();

  const { id: userId } = useSelector((state: IReduxStore) => state.user);

  const [sourceToDelete, setSourceToDelete] = React.useState(
    undefined as Source | undefined
  );
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  const { data: dataSources, loading: loadingSources } = useQuery(qSources, {
    variables: {
      userId
    },
    fetchPolicy: 'network-only'
  });

  const removeSourceFromCache = (
    cache: any,
    { data: { deleteSource } }: any
  ): void => {
    try {
      const { sources } = cache.readQuery({
        query: qSources,
        variables: {
          userId
        }
      });

      const newSources = sources.filter((s: any) => s.id !== deleteSource.id);

      cache.writeQuery({
        query: qSources,
        variables: {
          userId
        },
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

  const onClickedSource = async (source: any) => {
    try {
      const response = await fetch(
        `${HTTP_BACKEND_URL}/schemas/${source.template.name}_${source.name}.json`
      );
      const body = await response.json();
      if (response.status !== 200) {
        throw new Error(body.error);
      }
      dispatch(changeSelectedSource(source, body));
    } catch (err) {
      console.log(`error fetching source schema: ${err}`);
      dispatch(changeSelectedSource(source, undefined));
    }
    history.push({
      pathname: '/mapping',
      search: QueryString.stringify({
        sourceId: source.id
      })
    });
  };

  function renderSource(source: any, index: number): ReactElement {
    return (
      <Card
        elevation={Elevation.TWO}
        interactive={true}
        key={index}
        onClick={(): Promise<void> => onClickedSource(source)}
      >
        <div className="card-header">
          <h2>
            {source.template.name} - {source.name}
          </h2>
          <Button
            icon={'delete'}
            loading={deletingSource && sourceToDelete?.id === source.id}
            minimal={true}
            onClick={(e: React.MouseEvent): void => {
              e.stopPropagation();
              setSourceToDelete(source);
              setIsAlertOpen(true);
            }}
          />
        </div>
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
  }

  return (
    <div>
      <Navbar />
      <div id="main-container-softwares">
        <Button
          icon="add"
          intent="primary"
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
            dataSources.sourcesForUser.map((source: any, index: number) =>
              renderSource(source, index)
            )
          )}
        </div>
        <Alert
          cancelButtonText="Cancel"
          confirmButtonText="Confirm"
          icon="trash"
          intent={Intent.DANGER}
          isOpen={isAlertOpen}
          canOutsideClickCancel={true}
          onClose={async (confirmed): Promise<void> => {
            setIsAlertOpen(false);
            if (confirmed) {
              await deleteSource({
                variables: {
                  id: sourceToDelete ? sourceToDelete.id : ''
                }
              });
            }
            setSourceToDelete(undefined);
          }}
        >
          <p>
            Etes-vous sûr de vouloir supprimer la source{' '}
            <b>{sourceToDelete ? sourceToDelete.name : ''}</b>? Cette action
            n'est pas réversible.
          </p>
        </Alert>
      </div>
    </div>
  );
};

export default SourcesView;
