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
    onChangeOwner: any,
    onChangeTable: any,
    onChangeColumn: any,
    databaseColumn: IDatabaseColumn,
    databaseSchema: IDatabaseSchema,
    dispatch?: any,
    label?: string,
    vertical?: boolean,
}

export interface IColumnPickerState {

}

export default class ColumnPicker extends React.Component<IColumnPickerProps, IColumnPickerState> {
    public render() {
        let {
            onChangeOwner,
            onChangeTable,
            onChangeColumn,
            databaseColumn,
            databaseSchema,
            dispatch,
            label,
            vertical,
        } = this.props

        let owners = Object.keys(databaseSchema)

        let tables = (databaseColumn && databaseColumn.owner) ?
            Object.keys(databaseSchema[databaseColumn.owner]) :
            []

        let columns = (databaseColumn && databaseColumn.table) ?
            databaseSchema[databaseColumn.owner][databaseColumn.table] :
            []

        let controlGroup = <ControlGroup fill={false} vertical={vertical || false}>
            <StringSelect
                dispatch={dispatch}
                icon={'group-objects'}
                inputItem={databaseColumn ? databaseColumn.owner : null}
                items={owners}
                onChange={onChangeOwner}
            />
            <StringSelect
                disabled={!databaseColumn.owner}
                dispatch={dispatch}
                icon={'th'}
                inputItem={databaseColumn ? databaseColumn.table : null}
                items={tables}
                onChange={onChangeTable}
            />
            <StringSelect
                disabled={!databaseColumn.table}
                dispatch={dispatch}
                icon={'column-layout'}
                inputItem={databaseColumn ? databaseColumn.column : null}
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
