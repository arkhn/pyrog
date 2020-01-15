import {
  Button,
  Checkbox,
  FileInput,
  FormGroup,
  InputGroup,
  IToastProps,
  ProgressBar,
  IToaster
} from '@blueprintjs/core';
import axios, { AxiosResponse } from 'axios';
import * as React from 'react';
import { Query, withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Navbar from 'components/navbar';

// Import types
import { ITemplate, IReduxStore, IView } from 'types';

import './style.scss';
import { loader } from 'graphql.macro';
import { HTTP_BACKEND_URL } from '../../constants';

// GRAPHQL OPERATIONS
const qSourceAndTemplateNames = loader(
  'src/graphql/queries/sourceAndTemplateNames.graphql'
);
const mCreateTemplate = loader('src/graphql/mutations/createTemplate.graphql');
const mCreateSource = loader('src/graphql/mutations/createSource.graphql');

export interface INewSourceState {}

interface IState {
  hasOwner: boolean;
  templateName: string;
  templateExists: boolean;
  sourceName: string;
  schemaFile?: File;
  mappingFile?: File;
}

interface INewSourceViewState extends IView, INewSourceState {
  toaster: IToaster;
}

const mapReduxStateToReactProps = (state: IReduxStore): INewSourceViewState => {
  return {
    data: state.data,
    dispatch: state.dispatch,
    toaster: state.toaster,
    user: state.dispatch
  };
};

class NewSourceView extends React.Component<INewSourceViewState, IState> {
  constructor(props: INewSourceViewState) {
    super(props);
    this.state = {
      hasOwner: false,
      templateName: '',
      templateExists: false,
      sourceName: '',
      schemaFile: undefined,
      mappingFile: undefined
    };
  }

  renderToastProps = ({
    action,
    uploadProgress,
    success,
    message
  }: any): IToastProps => {
    return {
      action,
      icon: 'cloud-upload',
      intent:
        typeof uploadProgress !== 'undefined'
          ? undefined
          : success
          ? 'success'
          : 'danger',
      message: uploadProgress ? (
        <ProgressBar
          intent={uploadProgress < 1 ? 'primary' : 'success'}
          value={uploadProgress}
        />
      ) : (
        message
      ),
      timeout: uploadProgress < 1 ? 0 : 2500
    };
  };

  uploadSchema = async (toastID: string): Promise<AxiosResponse> => {
    if (!this.state.schemaFile) {
      throw new Error('Database schema is missing');
    }
    if (!this.state.templateName) {
      throw new Error('Template name is missing');
    }
    if (!this.state.sourceName) {
      throw new Error('Source name is missing');
    }

    const fileName = this.state.templateName.concat('_', this.state.sourceName);
    const formData = new FormData();
    formData.append('schema', this.state.schemaFile, fileName);

    const CancelToken = axios.CancelToken;
    let cancel: any;

    return axios.request({
      cancelToken: new CancelToken((c: any) => {
        cancel = c;
      }),
      data: formData,
      method: 'post',
      url: `${HTTP_BACKEND_URL}/upload`,
      onUploadProgress: p => {
        this.props.toaster.show(
          this.renderToastProps({
            action: {
              onClick: () => {
                cancel();
              },
              text: 'Interrompre'
            },
            uploadProgress: p.loaded / p.total
          }),
          toastID
        );
      }
    });
  };

  createTemplate = () =>
    this.props.client.mutate({
      mutation: mCreateTemplate,
      variables: {
        name: this.state.templateName
      }
    });

  createSource = () =>
    new Promise(async (resolve, reject) => {
      const { templateName, sourceName, hasOwner, mappingFile } = this.state;
      if (mappingFile) {
        var reader = new FileReader();
        reader.onload = async (e: ProgressEvent<FileReader>) => {
          const mapping = e.target?.result;
          if (!mapping) {
            reject(e.target?.error);
          }
          try {
            JSON.parse(mapping as string);
          } catch (e) {
            reject(new Error(`could not parse ${mappingFile.name} as JSON`));
          }
          await this.props.client.mutate({
            mutation: mCreateSource,
            variables: {
              templateName,
              hasOwner,
              mapping,
              name: sourceName
            }
          });
          resolve();
        };
        reader.onerror = (e: ProgressEvent<FileReader>) => reject(e);
        reader.readAsText(mappingFile);
      } else {
        await this.props.client.mutate({
          mutation: mCreateSource,
          variables: {
            templateName,
            hasOwner,
            name: sourceName
          }
        });
        resolve();
      }
    });

  onFormSubmit = async (e: any) => {
    e.preventDefault();

    const toastID = this.props.toaster.show(
      this.renderToastProps({
        action: {
          text: 'Interrompre'
        },
        uploadProgress: 0
      })
    );

    try {
      const uploadResponse = await this.uploadSchema(toastID);

      if (uploadResponse.data.success) {
        // Create new template in Graphql if it doesn't exist
        if (!this.state.templateExists) {
          await this.createTemplate();
        }
        // Create new source in Graphql
        await this.createSource();
        // After source is created,
        // redirect to /sources page.
        this.props.toaster.show(
          this.renderToastProps({
            message: `Source ${this.state.sourceName} was created`,
            success: true
          }),
          toastID
        );
        this.props.history.push('/');
      } else {
        this.props.toaster.show(
          this.renderToastProps({
            message: uploadResponse.data.message,
            success: uploadResponse.data.success
          }),
          toastID
        );
      }
    } catch (e) {
      console.error(e);
      this.props.toaster.show(
        this.renderToastProps({
          message: e.message,
          success: false
        }),
        toastID
      );
    }
  };

  public render = () => {
    const { templateName, sourceName, schemaFile, mappingFile } = this.state;

    const schemaType = `
    [owner: string] : {
        [table: string]: string[]
    }`;

    const schemaExample = `
    {
        "$SYSTEM": {
            "PATIENT": [
                "ID",
                "PRENOM",
                "NOM"
            ]
        },
    }`;

    const sqlCommand = `
    SELECT OWNER, TABLE_NAME, COLUMN_NAME, DATA_TYPE FROM all_tab_columns;
    `;

    const sqlplusCommand = `
    set heading off;
    set underline off;
    set pagesize 0;
    set colsep ";";
    set trimspool on;
    set headsep off;
    set linesize 1000;
    set numw 64;
    spool schema_name.csv
    SELECT OWNER, TABLE_NAME, COLUMN_NAME, DATA_TYPE FROM all_tab_columns;
    `;

    return (
      <div>
        <Navbar />
        <div id="main-container-newsource">
          <Query fetchPolicy="network-only" query={qSourceAndTemplateNames}>
            {({ data, loading }: any) => {
              // Build a map where keys are template names
              // and values are lists of source names for each template
              const mapTemplateToSourceNames = data
                ? data.templates
                  ? data.templates.reduce(
                      (map: Record<string, string[]>, template: ITemplate) => {
                        map[template.name] = template.sources
                          ? template.sources.map(s => s.name)
                          : [];
                        return map;
                      },
                      {}
                    )
                  : {}
                : {};

              return (
                <form onSubmit={this.onFormSubmit}>
                  <h1>Nom du template</h1>
                  <InputGroup
                    onChange={(event: React.FormEvent<HTMLElement>) => {
                      const target = event.target as HTMLInputElement;
                      this.setState({
                        ...this.state,
                        templateName: target.value,
                        templateExists:
                          !!target.value &&
                          target.value in mapTemplateToSourceNames
                      });
                    }}
                    name={'templateName'}
                    placeholder="Nom du template..."
                    value={templateName}
                  />

                  <h1>Nom de la source</h1>
                  <FormGroup
                    helperText={
                      templateName &&
                      templateName in mapTemplateToSourceNames &&
                      mapTemplateToSourceNames[templateName].indexOf(
                        sourceName
                      ) >= 0 ? (
                        <p className={'warning'}>
                          Ce nom existe déjà pour ce template et n'est pas
                          disponible.
                        </p>
                      ) : null
                    }
                  >
                    <InputGroup
                      onChange={(event: React.FormEvent<HTMLElement>) => {
                        const target = event.target as HTMLInputElement;

                        this.setState({
                          ...this.state,
                          sourceName: target.value
                        });
                      }}
                      name={'sourceName'}
                      placeholder="Nom de la source..."
                      value={sourceName}
                    />
                  </FormGroup>

                  <h1>Schéma de la base *</h1>
                  <FileInput
                    fill
                    inputProps={{
                      onChange: (event: React.FormEvent<HTMLInputElement>) => {
                        const target = event.target as any;
                        this.setState({
                          ...this.state,
                          schemaFile: target.files[0]
                        });
                      },
                      name: 'schema'
                    }}
                    text={
                      schemaFile ? (
                        schemaFile.name
                      ) : (
                        <p className="disabled-text">Importer un schéma...</p>
                      )
                    }
                  />
                  <br />
                  <Checkbox
                    checked={this.state.hasOwner}
                    label="Le schéma a un OWNER"
                    onChange={(event: React.FormEvent<HTMLElement>) =>
                      this.setState({
                        hasOwner: !this.state.hasOwner
                      })
                    }
                  />
                  <br />
                  <h1>Importer un mapping existant (optionnel)</h1>
                  <FileInput
                    fill
                    inputProps={{
                      onChange: (event: React.FormEvent<HTMLInputElement>) => {
                        const target = event.target as any;
                        console.log(target.files[0]);
                        this.setState({
                          ...this.state,
                          mappingFile: target.files[0]
                        });
                      },
                      name: 'mapping'
                    }}
                    text={
                      mappingFile ? (
                        mappingFile.name
                      ) : (
                        <p className="disabled-text">Importer un mapping...</p>
                      )
                    }
                  />
                  <div className="align-right">
                    <Button
                      disabled={
                        !templateName ||
                        !sourceName ||
                        (templateName in mapTemplateToSourceNames &&
                          mapTemplateToSourceNames[templateName].indexOf(
                            sourceName
                          ) >= 0)
                      }
                      intent="primary"
                      large
                      type="submit"
                    >
                      Ajouter
                    </Button>
                  </div>

                  <p>
                    * Une source de données doit nécessairement être importée
                    avec un schéma de données SQL. Ce schéma doit être importé
                    au format JSON et organisé comme suit :
                  </p>
                  <pre>
                    <code dangerouslySetInnerHTML={{ __html: schemaType }} />
                  </pre>
                  <p>
                    Voici un exemple minimaliste de fichier représentant un
                    schéma de base de données JSON tel qu'il est requis par
                    notre application à l'heure actuelle :
                  </p>
                  <pre>
                    <code dangerouslySetInnerHTML={{ __html: schemaExample }} />
                  </pre>
                  <p>
                    Le schéma de données peut-être extrait en utilisant le
                    logiciel Toad avec cette commande SQL :
                  </p>
                  <pre>
                    <code dangerouslySetInnerHTML={{ __html: sqlCommand }} />
                  </pre>
                  <p>
                    ou en ligne de commande avec <code>sqlplus</code> :
                  </p>
                  <pre>
                    <code
                      dangerouslySetInnerHTML={{ __html: sqlplusCommand }}
                    />
                  </pre>
                </form>
              );
            }}
          </Query>
        </div>
      </div>
    );
  };
}

export default withRouter(
  withApollo(connect(mapReduxStateToReactProps)(NewSourceView) as any) as any
);
