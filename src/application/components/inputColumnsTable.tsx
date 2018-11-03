import * as React from "react";
import {
    Button,
    ControlGroup,
} from "@blueprintjs/core";

import StringSelect from '../components/selects/stringSelect'

import {
    IDatabaseSchema,
    IInputColumn,
    IFhirIntegrationSpec,
} from '../types'

import {
    clickRemoveInputColumn
} from '../actions/mapping'

import {scriptList} from '../mockdata/nameLists'
import {
    columnList,
    ownerList,
    tableList,
} from '../mockdata/database'

export interface IInputColumnsTableProps {
    spec: IFhirIntegrationSpec;
    databaseSchema: IDatabaseSchema;
    dispatch: any;
}

export interface IInputColumnsTableState {

}

export default class InputColumnsTable extends React.Component<IInputColumnsTableProps, IInputColumnsTableState> {
    private handleRemoveClick = (columnIndex: number) => {
        return (event: any) => {
            this.props.dispatch(clickRemoveInputColumn(columnIndex))
        }
    }

    public render() {
        let {
            spec,
            databaseSchema,
            dispatch,
        } = this.props;

        let rows = (spec && spec.inputColumns) ?
            spec.inputColumns.map((column: IInputColumn, index: number) =>
                <tr key={index}>
                    <td>
                        <Button
                            icon={'delete'}
                            minimal={true}
                            onClick={this.handleRemoveClick(index)}
                        />
                    </td>
                    <td>{`${column.owner} > ${column.table} > ${column.column}`}</td>
                    <td>
                        <StringSelect
                            inputItem={column.join ? column.join.sourceColumn : null}
                            items={columnList}
                            icon={'column-layout'}
                            action={null}
                            dispatch={dispatch}
                        />
                    </td>
                    <td>
                        <ControlGroup fill={false} vertical={true}>
                            <StringSelect
                                inputItem={column.join ? column.join.targetColumn.owner : null}
                                items={ownerList}
                                icon={'group-objects'}
                                action={null}
                                dispatch={dispatch}
                            />
                            <StringSelect
                                inputItem={column.join ? column.join.targetColumn.table : null}
                                items={tableList}
                                icon={'th'}
                                action={null}
                                dispatch={dispatch}
                            />
                            <StringSelect
                                inputItem={column.join ? column.join.targetColumn.column : null}
                                items={columnList}
                                icon={'column-layout'}
                                action={null}
                                dispatch={dispatch}
                            />
                        </ControlGroup>
                    </td>
                    <td>
                        <StringSelect
                            inputItem={column.script}
                            items={scriptList}
                            icon={'function'}
                            action={null}
                            dispatch={dispatch}
                        />
                    </td>
                    {
                        spec.inputColumns.length > 1 ?
                            (
                                index == 0 ?
                                    <td rowSpan={spec.inputColumns.length}>
                                        <StringSelect
                                            inputItem={spec.mergingScript}
                                            items={scriptList}
                                            icon={'function'}
                                            action={null}
                                            dispatch={dispatch}
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
                <table className={'bp3-dark'}>
                    <tbody>
                        <tr>
                            <th></th>
                            <th>Column Path</th>
                            <th colSpan={2}>Join</th>
                            <th>Column Script</th>
                            {(spec && spec.inputColumns.length> 1) ? <th>Final Script</th> : null}
                        </tr>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}
