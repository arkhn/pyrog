import {
  Button,
  Code,
  FileInput,
  FormGroup,
  InputGroup,
  IToastProps,
  Position,
  ProgressBar
} from "@blueprintjs/core";
import axios from "axios";
import * as React from "react";
import { Mutation, Query, withApollo } from "react-apollo";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Navbar from "../../utils/navbar";

// Import types
import { ISource, IReduxStore, IView } from "../../../types";

import { addToast } from "../../../actions/toastsProps";

import "./style.less";

// GRAPHQL OPERATIONS

// Queries
const allSources = require("../../graphql/queries/allSources.graphql");

// Mutations
const createSource = require("../../graphql/mutations/createSource.graphql");

export interface INewSourceState {}

interface IState {
  isUploading: boolean;
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

class NewSourceView extends React.Component<INewSourceViewState, IState> {
  constructor(props: INewSourceViewState) {
    super(props);
    this.state = {
      isUploading: false,
      sourceName: "",
      schemaFile: null
    };
  }

  onFormSubmit = (e: any) => {
    e.preventDefault();
    this.fileUpload(this.state.schemaFile);
  };

  fileUpload = (file: any) => {
    const formData = new FormData();
    formData.append("schema", file, this.state.sourceName);

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
      .then((response: any) => {
        // Create new source in Graphql
        if (response.data.success) {
          this.props.client
            .mutate({
              mutation: createSource,
              variables: {
                sourceName: this.state.sourceName
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
    const { data, dispatch } = this.props;

    const { isUploading, sourceName, schemaFile } = this.state;

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
          <Query fetchPolicy="network-only" query={allSources}>
            {({ data, loading }) => {
              const sourceNames = data.allSources
                ? data.allSources.map((source: ISource) => source.name)
                : null;

              return (
                <form onSubmit={this.onFormSubmit}>
                  <h1>Nom de la source</h1>
                  <FormGroup
                    helperText={
                      sourceNames && sourceNames.indexOf(sourceName) >= 0 ? (
                        <p className={"warning"}>
                          Ce nom existe déjà et n'est pas disponible.
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
                      name={"sourceName"}
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
                  <div className="align-right">
                    <Button
                      disabled={
                        !sourceNames ||
                        sourceNames.indexOf(sourceName) >= 0 ||
                        !sourceName ||
                        !schemaFile ||
                        isUploading
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
