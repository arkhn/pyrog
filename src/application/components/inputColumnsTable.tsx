import {
    Button,
    ControlGroup,
} from '@blueprintjs/core'
import * as React from 'react'

// Import custom components
import ColumnPicker from './columnPicker'
import StringSelect from './selects/stringSelect'

// Import custom types
import {
    IDatabaseSchema,
    IInputColumn,
    IFhirIntegrationSpec,
} from '../types'

// Import mock data
import {
    scriptList,
} from '../mockdata/nameLists'

export interface IProps {
    inputColumns: any;
    databaseSchema: IDatabaseSchema;
}

export interface IState {

}

export default class InputColumnsTable extends React.Component<IProps, IState> {
    private handleRemoveColumnClick = (columnIndex: number) => {
        return (event: any) => {
            // this.props.dispatch(clickRemoveInputColumn(columnIndex))
        }
    }

    private handleRemoveJoinClick = (columnIndex: number) => {
        return (event: any) => {
            // this.props.dispatch(clickRemoveJoin(columnIndex))
        }
    }

    private handleAddJoinClick = (columnIndex: number) => {
        return (event: any) => {
            // this.props.dispatch(clickAddJoin(columnIndex))
        }
    }

    public render() {
        let {
            inputColumns,
            databaseSchema,
        } = this.props

        let rows = (inputColumns) ?
            inputColumns.map((column: IInputColumn, index: number) =>
                <tr key={index}>
                    <td>
                        <Button
                            icon={'delete'}
                            minimal={true}
                            onClick={this.handleRemoveColumnClick(index)}
                        />
                    </td>
                    <td>{`${column.owner} > ${column.table} > ${column.column}`}</td>
                    {
                        column.join ?
                            <td>
                                <Button
                                    icon={'delete'}
                                    minimal={true}
                                    onClick={this.handleRemoveJoinClick(index)}
                                />
                            </td> :
                            <td colSpan={3}>
                                <Button
                                    icon={'add'}
                                    minimal={true}
                                    onClick={this.handleAddJoinClick(index)}
                                />
                            </td>
                    }
                    {
                        column.join ?
                            <td>
                                <StringSelect
                                    icon={'column-layout'}
                                    inputItem={column.join.sourceColumn}
                                    items={databaseSchema[column.owner][column.table]}
                                    onChange={null}
                                />
                            </td> :
                            null
                    }
                    {
                        column.join ?
                            <td>
                                <ColumnPicker
                                    databaseColumn={column.join.targetColumn}
                                    databaseSchema={databaseSchema}
                                    onChangeOwner={null}
                                    onChangeTable={null}
                                    onChangeColumn={null}
                                />
                            </td> :
                            null
                    }
                    <td>
                        <StringSelect
                            icon={'function'}
                            inputItem={column.script}
                            items={scriptList}
                            onChange={null}
                        />
                    </td>
                    {
                        inputColumns.length > 1 ?
                            (
                                index == 0 ?
                                    <td rowSpan={inputColumns.length}>
                                        <StringSelect
                                            icon={'function'}
                                            inputItem={inputColumns.mergingScript}
                                            items={scriptList}
                                            onChange={null}
                                        />
                                    </td> :
                                    null
                            ) :
                            null
                    }
                </tr>) :
            []

        return (
            <div>
                <table>
                    <tbody>
                        <tr>
                            <th></th>
                            <th>Column Path</th>
                            <th colSpan={3}>Join</th>
                            <th>Column Script</th>
                            {(inputColumns.length> 1) ? <th>Final Script</th> : null}
                        </tr>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}
