import {
    Button,
    Code,
    FileInput,
    InputGroup,
    Position,
} from '@blueprintjs/core'
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
    IReduxStore,
    IView,
} from '../../../types'

import { addToast } from '../../../actions/toastsProps'

import './style.less'

// GRAPHQL OPERATIONS

// Mutations
const mutationLogin = require('./graphql/mutations/login.graphql')

export interface INewSourceState {

}

interface IState {
    sourceName: string,
    schemaFile: any,
}

interface INewSourceViewState extends IView, INewSourceState {}

const mapReduxStateToReactProps = (state : IReduxStore): INewSourceViewState => {
    return {
        data: state.data,
        dispatch: state.dispatch,
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

        return fetch(SCHEMA_URL, {
            headers: {},
            method: 'POST',
            body: formData,
        })
        .then((response: any) => {
            return response.json()
        }).then((response: any) => {
            this.props.dispatch(addToast({
                icon: response.success ? 'upload' : 'cross',
                message: response.message,
                intent: response.success ? 'success' : 'danger',
                timeout: 2000,
            }))

            if (response.success) {
                // console.log('should redirect')
                this.props.history.push('/sources')
            }
        })
    }

    public render = () => {
        const {
            data,
            dispatch,
        } = this.props

        const {
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
                <form
                    onSubmit={this.onFormSubmit}
                >
                    <h1>Nom de la source</h1>
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

                    <h1>Schéma de la base</h1>
                    <p>
                        Une source de données doit nécessairement être importée avec un schéma de données SQL. Ce schéma doit être importé au format JSON et organisé comme suit :
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
                    <Button
                        disabled={!sourceName || !schemaFile}
                        intent='primary'
                        large
                        type="submit"
                    >
                        Ajouter
                    </Button>
                </form>
            </div>
        </div>
    }
}

export default withRouter(connect(mapReduxStateToReactProps)(NewSourceView) as any)
