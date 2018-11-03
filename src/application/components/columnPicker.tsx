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
    databaseColumn: IDatabaseColumn,
    databaseSchema: IDatabaseSchema,
    dispatch: any,
}

export interface IColumnPickerState {

}

export default class ColumnPicker extends React.Component<IColumnPickerProps, IColumnPickerState> {
    public render() {
        let {
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
            Object.keys(databaseSchema[owner][table]) :
            []

        return (
            <FormGroup
                label="label"
                labelFor="text-input"
                inline={true}
            >
                <ControlGroup fill={false} vertical={false}>
                    <StringSelect
                        inputItem={owner}
                        items={owners}
                        icon={'group-objects'}
                        action={null}
                        dispatch={dispatch}
                    />
                    <StringSelect
                        inputItem={table}
                        items={tables}
                        icon={'th'}
                        action={null}
                        dispatch={dispatch}
                    />
                    <StringSelect
                        inputItem={column}
                        items={columns}
                        icon={'column-layout'}
                        action={null}
                        dispatch={dispatch}
                    />
                </ControlGroup>
            </FormGroup>
        );
    }
}
