import {
    Button,
    Code,
    FileInput,
    FormGroup,
    InputGroup,
    IToastProps,
    Position,
    ProgressBar,
} from '@blueprintjs/core'
import axios from 'axios'
import * as React from 'react'
import {
    Mutation,
    Query,
} from 'react-apollo'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { SCHEMA_URL } from '../../../constants'

import Navbar from '../../utils/navbar'

// Import types
import {
    IDatabase,
    IReduxStore,
    IView,
} from '../../../types'

import { addToast } from '../../../actions/toastsProps'

import './style.less'

// GRAPHQL OPERATIONS

// Queries
const allDatabases = require('./graphql/queries/allDatabases.graphql')

// Mutations
const mutationLogin = require('./graphql/mutations/login.graphql')

export interface INewSourceState {

}

interface IState {
    isUploading: boolean,
    sourceName: string,
    schemaFile: any,
}

interface INewSourceViewState extends IView, INewSourceState {}

const mapReduxStateToReactProps = (state : IReduxStore): INewSourceViewState => {
    return {
        data: state.data,
        dispatch: state.dispatch,
        toaster: state.toaster,
        user: state.dispatch,
    }
}

const reduxify = (mapReduxStateToReactProps: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) : any => {
     return (target: any) => (
         connect(
             mapReduxStateToReactProps,
             mapDispatchToProps,
             mergeProps,
             options
         )(target) as any
     )
}

class NewSourceView extends React.Component<INewSourceViewState, IState> {
    constructor(props: INewSourceViewState) {
        super(props)
        this.state = {
            isUploading: false,
            sourceName: "",
            schemaFile: null,
        }
    }

    onFormSubmit = (e: any) => {
        e.preventDefault()
        this.fileUpload(this.state.schemaFile)
    }

    fileUpload = (file: any) => {
        const formData = new FormData()
        formData.append('schema', file, this.state.sourceName)

        this.setState({
            ...this.state,
            isUploading: true,
        })

        const renderToastProps = ({ action, uploadProgress, success, message }: any): IToastProps => {
            return {
                action,
                icon: "cloud-upload",
                intent: typeof uploadProgress !== 'undefined' ? null : (success ? 'success' : 'danger'),
                message: (uploadProgress ?
                    <ProgressBar
                        intent={uploadProgress < 1 ? 'primary' : 'success'}
                        value={uploadProgress}
                    /> :
                    message),
                timeout: uploadProgress < 1 ? 0 : 2500,
            }
        }

        const CancelToken = axios.CancelToken
        let cancel: any

        const key = this.props.toaster.show(renderToastProps({
            action: {
                onClick: () => {
                    cancel()
                },
                text: 'Interrompre',
            },
            uploadProgress: 0,
        }))

        return axios.request({
            cancelToken: new CancelToken((c: any) => {
                cancel = c;
            }),
            data: formData,
            method: "post",
            url: `${SCHEMA_URL}/upload`,
            onUploadProgress: (p) => {
                this.props.toaster.show(renderToastProps({
                    action: {
                        onClick: () => {
                            cancel()
                        },
                        text: 'Interrompre',
                    },
                    uploadProgress: p.loaded / p.total,
                }), key)
            }
        }).then((response: any) => {
            this.props.toaster.show(renderToastProps({
                message: response.data.message,
                success: response.data.success,
            }), key)

            if (response.data.success) {
                this.setState({
                    ...this.state,
                    isUploading: false,
                })

                this.props.history.push('/sources')
            }
        }).catch((response: any) => {
            this.setState({
                ...this.state,
                isUploading: false,
            })

            this.props.toaster.show(renderToastProps({
                message: 'Annulé',
                success: false,
            }), key)
        })
    }

    public render = () => {
        const {
            data,
            dispatch,
        } = this.props

        const {
            isUploading,
            sourceName,
            schemaFile,
        } = this.state

        const schemaType: string = `
[owner: string] : {
    [table: string]: string[]
}`

        const schemaExample: string = `
{
    "$SYSTEM": {
        "PATIENT": [
            "ID",
            "PRENOM",
            "NOM"
        ]
    },
}`

        return <div>
            <Navbar />
            <div id='main-container-newsource'>
                <Query
                    query={allDatabases}
                >
                    {({ data, loading}) => {
                        const databaseNames = data.allDatabases ?
                            data.allDatabases.map((database: IDatabase) => database.name) :
                            null

                        return <form
                            onSubmit={this.onFormSubmit}
                        >
                            <h1>Nom de la source</h1>
                            <FormGroup
                                helperText={databaseNames && databaseNames.indexOf(sourceName) >= 0 ? <p className={'warning'}>Ce nom existe déjà et n'est pas disponible.</p>  : null}
                            >
                                <InputGroup
                                    onChange={(event: React.FormEvent<HTMLElement>) => {
                                        const target = event.target as HTMLInputElement

                                        this.setState({
                                            ...this.state,
                                            sourceName: target.value,
                                        })
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
                                        const target = event.target as any
                                        this.setState({
                                            ...this.state,
                                            schemaFile: target.files[0],
                                        })
                                    },
                                    name: 'schema',
                                }}
                                text={schemaFile ?
                                    schemaFile.name :
                                    <p className='disabled-text'>Importer un schéma...</p>
                                }
                            />
                            <br/>
                            <div className="align-right">
                                <Button
                                    disabled={!databaseNames || databaseNames.indexOf(sourceName) >= 0 || !sourceName || !schemaFile || isUploading}
                                    intent='primary'
                                    large
                                    type="submit"
                                >
                                    Ajouter
                                </Button>
                            </div>

                            <p>
                                * Une source de données doit nécessairement être importée avec un schéma de données SQL. Ce schéma doit être importé au format JSON et organisé comme suit :
                            </p>
                            <pre>
                                <code dangerouslySetInnerHTML={{__html: schemaType}} />
                            </pre>
                            <p>
                                Voici un exemple minimaliste de fichier représentant un schéma de base de données JSON tel qu'il est requis par notre application à l'heure actuelle :
                            </p>
                            <pre>
                                <code dangerouslySetInnerHTML={{__html: schemaExample}} />
                            </pre>
                        </form>
                    }}
                </Query>
            </div>
        </div>
    }
}

export default withRouter(connect(mapReduxStateToReactProps)(NewSourceView) as any)
