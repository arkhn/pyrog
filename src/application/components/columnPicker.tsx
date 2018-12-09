import {
    ControlGroup,
    FormGroup,
    InputGroup,
    Switch
} from '@blueprintjs/core'
import * as React from 'react'

import StringSelect from './selects/stringSelect'
import {
    IDatabaseColumn,
    IDatabaseSchema,
} from '../types'

export interface IProps {
    ownerChangeCallback?: any,
    tableChangeCallback?: any,
    columnChangeCallback?: any,
    initialColumn?: {
        owner: string,
        table: string,
        column: string,
    }
    onChangeOwner?: any,
    onChangeTable?: any,
    onChangeColumn?: any,
    databaseSchema: IDatabaseSchema,
    label?: string,
    vertical?: boolean,
}

export interface IState {
    owner: string,
    table: string,
    column: string,
}

export default class ColumnPicker extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            owner: null,
            table: null,
            column: null,
        }
    }

    private changeOwner = (e: string) => {
        this.setState({
            owner: e,
            table: null,
            column: null,
        })

        if (this.props.ownerChangeCallback) {
            this.props.ownerChangeCallback(e)
        }
    }

    private changeTable = (e: string) => {
        this.setState({
            table: e,
            column: null,
        })

        if (this.props.tableChangeCallback) {
            this.props.tableChangeCallback(e)
        }
    }

    private changeColumn = (e: string) => {
        this.setState({
            column: e,
        })

        if (this.props.columnChangeCallback) {
            this.props.columnChangeCallback(e)
        }
    }

    private static getDerivedStateFromProps(props: IProps, state: IState) {
        if (props.initialColumn) {
            return {
                owner: props.initialColumn.owner,
                table: props.initialColumn.table,
                column: props.initialColumn.column,
            }
        }

        return state
    }

    public render() {
        let {
            onChangeOwner,
            onChangeTable,
            onChangeColumn,
            databaseSchema,
            label,
            vertical,
        } = this.props

        let {
            owner,
            table,
            column,
        } = this.state

        let owners = Object.keys(databaseSchema)

        let tables = owner ?
            Object.keys(databaseSchema[owner]) :
            []

        let columns = table ?
            databaseSchema[owner][table] :
            []

        let controlGroup = <ControlGroup fill={false} vertical={vertical || false}>
            <StringSelect
                icon={'group-objects'}
                inputItem={owner}
                items={owners}
                onChange={this.changeOwner}
            />
            <StringSelect
                disabled={!owner}
                icon={'th'}
                inputItem={table}
                items={tables}
                onChange={this.changeTable}
            />
            <StringSelect
                disabled={!table}
                icon={'column-layout'}
                inputItem={column}
                items={columns}
                onChange={this.changeColumn}
            />
        </ControlGroup>

        return label ?
            <FormGroup
                label={label}
                labelFor="text-input"
                inline={true}
            >
                {controlGroup}
            </FormGroup> :
            controlGroup
    }
}
