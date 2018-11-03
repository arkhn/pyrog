import {
    Button,
    ControlGroup,
    FormGroup,
    Icon,
    Tab,
    Tabs,
    TabId
} from '@blueprintjs/core'
import * as React from 'react'

// Import custom actions
import {
    clickAddInputColumn,
} from '../actions/mapping'

// Import custom components
import ClusterSearchInputs from './clusterSearchInputs'
import ColumnPicker from './columnPicker'
import ColumnViewer from './columnViewer'
import TextSearchInputs from './textSearchInputs'

// Import custom types
import {
    IDatabaseColumn,
    IDatabaseSchema,
} from '../types'

// Import mock data
import {
    firstNameColumnsExample,
    filePathColumnsExample
} from '../mockdata/database'

export interface ITabViewProps {
    databaseSchema: IDatabaseSchema,
    dispatch: any,
}

export interface ITabViewState {
    databaseColumn: IDatabaseColumn,
    navbarTabId: TabId,
}

export default class TabViewer extends React.Component<ITabViewProps, ITabViewState> {
    public state: ITabViewState = {
        databaseColumn: {
            owner: null,
            table: null,
            column: null,
        },
        navbarTabId: 'dummy',
    }

    private handleNavbarTabChange = (navbarTabId: TabId) => {
        this.setState({
            navbarTabId,
        })
    }

    private changeOwner = (owner: string) => {
        const change = (owner != this.state.databaseColumn.owner)

        this.setState({
            databaseColumn: {
                owner: owner,
                table: change ? null : this.state.databaseColumn.table,
                column: change ? null : this.state.databaseColumn.column,
            }
        })
    }

    private changeTable = (table: string) => {
        const change = (table != this.state.databaseColumn.table)

        this.setState({
            databaseColumn: {
                owner: this.state.databaseColumn.owner,
                table: table,
                column: change ? null : this.state.databaseColumn.column,
            }
        })
    }
    private changeColumn = (column: string) => {
        this.setState({
            databaseColumn: {
                owner: this.state.databaseColumn.owner,
                table: this.state.databaseColumn.table,
                column: column,
            }
        })
    }

    private handleClick = (column: any) => {
        this.props.dispatch(clickAddInputColumn(this.state.databaseColumn))
        this.setState({
            databaseColumn: {
                owner: null,
                table: null,
                column: null,
            },
        })
    }

    public render() {
        let {
            databaseSchema,
            dispatch,
        } = this.props

        let {
            databaseColumn,
            navbarTabId,
        } = this.state

        // Dummy column selector tab
        const dummyTabTitle = <div className={'tab-title'}>
            <Icon icon={'panel-table'} />
            <span>Column Selector</span>
        </div>

        const dummyTab = <div id={'dummy-column-picker'}>
            <FormGroup
                label={'Choose column'}
                labelFor="text-input"
                inline={true}
            >
                <ControlGroup>
                    <ColumnPicker
                        changeOwner={this.changeOwner}
                        changeTable={this.changeTable}
                        changeColumn={this.changeColumn}
                        databaseColumn={databaseColumn}
                        databaseSchema={databaseSchema}
                        dispatch={dispatch}
                    />
                    <Button
                        disabled={!databaseColumn.column}
                        icon={'add'}
                        onClick={this.handleClick}
                    />
                </ControlGroup>
            </FormGroup>
        </div>

        // Cluster tab
        const clusterTabTitle = <div className={'tab-title'}>
            <Icon icon={'layout'} />
            <span>Explore Clusters (soon...)</span>
        </div>

        const clusterTab = <div className={'vertical-flex'}>
            <ClusterSearchInputs dispatch={dispatch} />
            <ColumnViewer
                dispatch={dispatch}
                data={filePathColumnsExample}
            />
        </div>

        // Text search tab
        const textTabTitle = <div className={'tab-title'}>
            <Icon icon={'paragraph'} />
            <span>Search by Text (soon...)</span>
        </div>

        const textTab = <div className={'vertical-flex'}>
            <TextSearchInputs dispatch={dispatch} />
            <ColumnViewer
                dispatch={dispatch}
                data={firstNameColumnsExample}
            />
        </div>

        return (
            <Tabs
                selectedTabId={navbarTabId} onChange={this.handleNavbarTabChange}
            >
                <Tab
                    id="dummy"
                    title={dummyTabTitle}
                    panel={dummyTab}
                />
                <Tab
                    id="text"
                    title={textTabTitle}
                    panel={textTab}
                    disabled={true}
                />
                <Tab
                    id="clustering"
                    title={clusterTabTitle}
                    panel={clusterTab}
                    disabled={true}
                />
            </Tabs>
        );
    }
}
