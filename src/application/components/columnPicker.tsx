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

export interface IColumnPickerProps {
    changeOwner: any,
    changeTable: any,
    changeColumn: any,
    databaseColumn: IDatabaseColumn,
    databaseSchema: IDatabaseSchema,
    dispatch: any,
    vertical?: boolean,
}

export interface IColumnPickerState {

}

export default class ColumnPicker extends React.Component<IColumnPickerProps, IColumnPickerState> {
    public render() {
        let {
            changeOwner,
            changeTable,
            changeColumn,
            databaseColumn,
            databaseSchema,
            dispatch,
        } = this.props

        let {
            owner,
            table,
            column
        } = databaseColumn

        let owners = Object.keys(databaseSchema)

        let tables = owner ?
            Object.keys(databaseSchema[owner]) :
            []

        let columns = table ?
            databaseSchema[owner][table] :
            []

        return (
            <FormGroup
                label="label"
                labelFor="text-input"
                inline={true}
            >
                <ControlGroup fill={false} vertical={this.props.vertical || false}>
                    <StringSelect
                        inputItem={owner}
                        items={owners}
                        icon={'group-objects'}
                        action={changeOwner}
                        dispatch={dispatch}
                    />
                    <StringSelect
                        inputItem={table}
                        items={tables}
                        icon={'th'}
                        action={changeTable}
                        dispatch={dispatch}
                    />
                    <StringSelect
                        inputItem={column}
                        items={columns}
                        icon={'column-layout'}
                        action={changeColumn}
                        dispatch={dispatch}
                    />
                </ControlGroup>
            </FormGroup>
        );
    }
}
