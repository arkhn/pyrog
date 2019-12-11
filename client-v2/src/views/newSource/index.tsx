import {
  Button,
  Checkbox,
  FormGroup,
  InputGroup,
} from '@blueprintjs/core';
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
  templateName: string;
  templateExists: boolean;
  sourceName: string;
  hasOwner: boolean;
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
      templateName: '',
      templateExists: false,  // TODO check if really needed in state
      sourceName: '',
      hasOwner: false,
    };
  }

  onFormSubmit = async (e: any) => {
    e.preventDefault();

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

    // Create new source in Graphql
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
        this.props.history.push('/sources');
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  public render = () => {
    const { templateName, sourceName } = this.state;

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
