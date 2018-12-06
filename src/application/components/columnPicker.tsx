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
    onChangeOwner: any,
    onChangeTable: any,
    onChangeColumn: any,
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
                onChange={onChangeOwner}
            />
            <StringSelect
                disabled={!owner}
                icon={'th'}
                inputItem={table}
                items={tables}
                onChange={onChangeTable}
            />
            <StringSelect
                disabled={!table}
                icon={'column-layout'}
                inputItem={column}
                items={columns}
                onChange={onChangeColumn}
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
