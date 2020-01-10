import {
  Breadcrumbs,
  Callout,
  ControlGroup,
  Icon,
  InputGroup
} from '@blueprintjs/core';
import * as React from 'react';
import { connect } from 'react-redux';

import './style.scss';

// Import custom actions
import { addInputColumn, changeMotClefMimic, changeTypeMimic } from './actions';

import { fetchBetaRecommendedColumns } from 'services/recommendedColumns/actions';

// Import custom components
import StringSelect from 'components/selects/stringSelect';

// Import mockdata
import { availableTypes, questions } from 'mockdata/mimic';

// Import custom types
import { IReduxStore, IView } from 'types';

// Mimic types

export interface IMimicState {
  stateByAttribute: {
    [attribute_flat: string]: {
      input_columns?: any;
      type?: string;
      mot_clef?: string;
    };
  };
  question_index: number;
  section_index: number;
}

export interface IMimicViewState extends IView, IMimicState {}

// Redux's state mapping to react props
const mapReduxStateToReactProps = (state: IReduxStore): IMimicViewState => {
  return {
    ...state.views.mimic,
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

@reduxify(mapReduxStateToReactProps)
export default class MainView extends React.Component<IMimicViewState, any> {
  public componentDidMount() {
    const { question_index, section_index } = this.props;

    questions[question_index].sections[section_index].mapping_items.forEach(
      (item: any) => {
        if (item.type) {
          this.props.dispatch(
            fetchBetaRecommendedColumns(
              item.fhir_attribute,
              item.type,
              questions[question_index].sections[section_index].head_table,
              ''
            )
          );
        }
      }
    );
  }

  public render() {
    const {
      data,
      stateByAttribute,
      question_index,
      section_index
    } = this.props;

    return (
      <div id="mimic-poc">
        <h1>
          {questions[question_index].chapter_name} -{' '}
          {questions[question_index].sections[section_index].resource}
        </h1>

        {questions[question_index].sections[section_index].mapping_items.map(
          (item: any, index: number) => {
            const suggested_columns = data!.recommendedColumns
              .columnsByAttribute[item.fhir_attribute]
              ? data!.recommendedColumns.columnsByAttribute[
                  item.fhir_attribute
                ].map((column: any, index: number) => {
                  return (
                    <div key={index}>
                      <div
                        className={'add-button'}
                        onClick={() =>
                          this.props.dispatch(
                            addInputColumn(item.fhir_attribute, column.column)
                          )
                        }
                      >
                        <Icon icon={'plus'} />
                      </div>
                      <div className={'column'}>
                        <div className={'column-header'}>
                          {column.column
                            .split('.')
                            .map((element: string, index: number) => {
                              return (
                                <div key={index}>
                                  {index + 1 ==
                                  column.column.split('.').length ? (
                                    <strong>{element}</strong>
                                  ) : (
                                    element.toUpperCase()
                                  )}
                                </div>
                              );
                            })}
                          <div>{Math.round(column.score * 100) / 100}</div>
                        </div>
                        <div className={'column-rows'}>
                          {column.data
                            .slice(1, 10)
                            .map((entry: string, index: number) => (
                              <div key={index}>{entry}</div>
                            ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              : null;

            const input_columns =
              stateByAttribute[item.fhir_attribute] &&
              stateByAttribute[item.fhir_attribute].input_columns
                ? stateByAttribute[item.fhir_attribute].input_columns.map(
                    (column: any, index: number) => {
                      return (
                        <div key={index}>
                          <Breadcrumbs
                            items={column.split('.')}
                            breadcrumbRenderer={(item: any) => {
                              return (
                                <div key={index}>{item.toUpperCase()}</div>
                              );
                            }}
                            currentBreadcrumbRenderer={(item: any) => {
                              return (
                                <div key={index}>
                                  <strong>{item}</strong>
                                </div>
                              );
                            }}
                          />
                        </div>
                      );
                    }
                  )
                : null;

            return (
              <div className={'question'} key={index}>
                <Callout
                  className={'callout'}
                  title={`${index + 1}. ${item.title}`}
                >
                  {item.text}
                  <div className={'input-columns'}>{input_columns}</div>
                  <div className={'column-selector'}>
                    <ControlGroup>
                      <StringSelect
                        icon={'layout-hierarchy'}
                        inputItem={stateByAttribute[item.fhir_attribute].type!}
                        intent={'primary'}
                        items={Object.keys(availableTypes)}
                        onChange={(e: any) =>
                          this.props.dispatch(
                            changeTypeMimic(
                              item.fhir_attribute,
                              e,
                              questions[question_index].sections[section_index]
                                .head_table,
                              stateByAttribute[item.fhir_attribute].mot_clef!
                            )
                          )
                        }
                      />
                      <InputGroup
                        leftIcon="search"
                        onChange={(e: any) => {
                          this.props.dispatch(
                            changeMotClefMimic(
                              item.fhir_attribute,
                              stateByAttribute[item.fhir_attribute].type!,
                              questions[question_index].sections[section_index]
                                .head_table,
                              e.target.value
                            )
                          );
                        }}
                        placeholder="Mot clef"
                        value={stateByAttribute[item.fhir_attribute].mot_clef}
                      />
                    </ControlGroup>
                  </div>
                  {suggested_columns ? (
                    <div className={'column-viewer'}>
                      <div className={'column-flexbox'}>
                        {suggested_columns}
                      </div>
                    </div>
                  ) : null}
                </Callout>
              </div>
            );
          }
        )}
      </div>
    );
  }
}
