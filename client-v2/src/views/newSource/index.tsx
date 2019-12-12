import {
  Button,
  Checkbox,
  FileInput,
  FormGroup,
  InputGroup,
  IToastProps,
  ProgressBar,
} from '@blueprintjs/core';
import axios from "axios";
import * as React from 'react';
import { Query, withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Navbar from '../../components/Navbar';

// Import types
import { ITemplate, IReduxStore, IView } from '../../types';

import './style.less';

// GRAPHQL OPERATIONS
const qSourceAndTemplateNames = require('../../graphql/queries/sourceAndTemplateNames.graphql');
const mCreateTemplate = require('../../graphql/mutations/createTemplate.graphql');
const mCreateSource = require('../../graphql/mutations/createSource.graphql');

export interface INewSourceState {}

interface IState {
  hasOwner: boolean;
  isUploading: boolean;
  templateName: string;
  templateExists: boolean;
  sourceName: string;
  schemaFile: any;
}

interface INewSourceViewState extends IView, INewSourceState {}

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
      isUploading: false,
      templateName: '',
      templateExists: false,  // TODO check if really needed in state
      sourceName: '',
      schemaFile: null,
    };
  }

  onFormSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("schema", this.state.schemaFile, this.state.sourceName);

    this.setState({
      ...this.state,
      isUploading: true
    });

    const renderToastProps = ({
      action,
      uploadProgress,
      success,
      message
    }: any): IToastProps => {
      return {
        action,
        icon: "cloud-upload",
        intent:
          typeof uploadProgress !== "undefined"
            ? null
            : success
            ? "success"
            : "danger",
        message: uploadProgress ? (
          <ProgressBar
            intent={uploadProgress < 1 ? "primary" : "success"}
            value={uploadProgress}
          />
        ) : (
          message
        ),
        timeout: uploadProgress < 1 ? 0 : 2500
      };
    };

    const CancelToken = axios.CancelToken;
    let cancel: any;

    const key = this.props.toaster.show(
      renderToastProps({
        action: {
          onClick: () => {
            cancel();
          },
          text: "Interrompre"
        },
        uploadProgress: 0
      })
    );

    return axios
      .request({
        cancelToken: new CancelToken((c: any) => {
          cancel = c;
        }),
        data: formData,
        method: "post",
        url: `${process.env.HTTP_BACKEND_URL}/upload`,
        onUploadProgress: p => {
          this.props.toaster.show(
            renderToastProps({
              action: {
                onClick: () => {
                  cancel();
                },
                text: "Interrompre"
              },
              uploadProgress: p.loaded / p.total
            }),
            key
          );
        }
      })
      .then(async (response: any) => {
        // Create new source in Graphql
        if (response.data.success) {
          // Create new template in Graphql if it doesn't exist
          if (!this.state.templateExists) {
            await this.props.client
              .mutate({
                mutation: mCreateTemplate,
                variables: {
                  name: this.state.templateName,
                }
              })
          }
          this.props.client
            .mutate({
              mutation: mCreateSource,
              variables: {
                templateName: this.state.templateName,
                name: this.state.sourceName,
                hasOwner: this.state.hasOwner,
              }
            })
            .then((graphqlResponse: any) => {
              // After source is created,
              // redirect to /sources page.
              this.props.toaster.show(
                renderToastProps({
                  message: response.data.message,
                  success: response.data.success
                }),
                key
              );

              this.setState({
                ...this.state,
                isUploading: false
              });

              this.props.history.push("/sources");
            })
            .catch((error: any) => {
              console.log(error);
            });
        } else {
          this.props.toaster.show(
            renderToastProps({
              message: response.data.message,
              success: response.data.success
            }),
            key
          );
        }
      })
      .catch((response: any) => {
        this.setState({
          ...this.state,
          isUploading: false
        });

        this.props.toaster.show(
          renderToastProps({
            message: "Annulé",
            success: false
          }),
          key
        );
      });
  };

  public render = () => {
    const { isUploading, templateName, sourceName, schemaFile } = this.state;

    const schemaType: string = `
    [owner: string] : {
        [table: string]: string[]
    }`;
    
        const schemaExample: string = `
    {
        "$SYSTEM": {
            "PATIENT": [
                "ID",
                "PRENOM",
                "NOM"
            ]
        },
    }`;
    
        const sqlCommand: string = `
    SELECT OWNER, TABLE_NAME, COLUMN_NAME, DATA_TYPE FROM all_tab_columns;
    `;
    
        const sqlplusCommand: string = `
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
              const mapTemplateToSourceNames =
                data
                ? data.templates
                  ? data.templates.reduce((map: Record<string, string[]>, template: ITemplate) => {
                      map[template.name] = 
                        (template.sources ? template.sources.map(s => s.name) : [])
                    return map;
                  }, {})
                  : {}
                : {}

              return (
                <form onSubmit={this.onFormSubmit}>
                  <h1>Nom du template</h1>
                  <InputGroup
                    onChange={(event: React.FormEvent<HTMLElement>) => {
                      const target = event.target as HTMLInputElement;
                      this.setState({
                        ...this.state,
                        templateName: target.value,
                        templateExists: target.value && target.value in mapTemplateToSourceNames
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
                      templateName in mapTemplateToSourceNames
                      && mapTemplateToSourceNames[templateName].indexOf(sourceName) >= 0 ? (
                        <p className={'warning'}>
                          Ce nom existe déjà pour ce template et n'est pas disponible.
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
                      name: "schema"
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
                  <div className="align-right">
                    <Button
                      disabled={
                        !templateName ||
                        !sourceName ||
                        (templateName in mapTemplateToSourceNames
                          && mapTemplateToSourceNames[templateName].indexOf(sourceName) >= 0)
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

export default withRouter(withApollo(connect(mapReduxStateToReactProps)(
  NewSourceView
) as any) as any);
