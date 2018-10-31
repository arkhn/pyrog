import * as React from "react";
import {
    Button,
    ControlGroup,
} from "@blueprintjs/core";

import StringSelect from '../components/selects/stringSelect'

import {IInputColumn} from '../types'

import {scriptList} from '../mockdata/nameLists'
<<<<<<< HEAD
import {
    columnList,
    ownerList,
    tableList,
} from '../mockdata/database'
=======
>>>>>>> 25ba351f1457440f7b1863c4345fa1415e20899f

export interface IInputColumnsTableProps {
    columns: IInputColumn[];
    currentOwnerList: string[];
    currentTableList: string[];
    currentColumnList: string[];
    dispatch: any;
}

export interface IInputColumnsTableState {

}

export default class InputColumnsTable extends React.Component<IInputColumnsTableProps, IInputColumnsTableState> {
    public render() {
        let {columns, currentOwnerList, currentTableList, currentColumnList, dispatch} = this.props;

        let rows = columns ? columns.map((column: IInputColumn, index: number) =>
            <tr
                key={index}
            >
                <td>
                    <Button
                        icon={'delete'}
                        minimal={true}
                    />
                </td>
                <td>{`${column.owner} > ${column.table} > ${column.column}`}</td>
                <td>
                    <StringSelect
                        inputItem={null}
                        items={columnList}
                        icon={'column-layout'}
                        action={null}
                        dispatch={dispatch}
                    />
                </td>
                <td>
                    <ControlGroup fill={false} vertical={false}>
                        <StringSelect
                            inputItem={null}
                            items={ownerList}
                            icon={'group-objects'}
                            action={null}
                            dispatch={dispatch}
                        />
                        <StringSelect
                            inputItem={null}
                            items={tableList}
                            icon={'th'}
                            action={null}
                            dispatch={dispatch}
                        />
                        <StringSelect
                            inputItem={null}
                            items={columnList}
                            icon={'column-layout'}
                            action={null}
                            dispatch={dispatch}
                        />
                    </ControlGroup>
                </td>
                <td>
                    <StringSelect
                        inputItem={null}
                        items={scriptList}
                        icon={'function'}
                        action={null}
                        dispatch={dispatch}
                    />
                </td>
                {columns.length > 1 ?
                    (index == 0 ?
                        <td rowSpan={columns.length}>
                            <StringSelect
                                inputItem={null}
                                items={scriptList}
                                icon={'function'}
                                action={null}
                                dispatch={dispatch}
                            />
                        </td>
                    : null)
                : null}
            </tr>
        ) : []

        return (
            <div>
                <table className={'bp3-dark'}>
                    <tbody>
                        <tr>
                            <th></th>
                            <th>Column Path</th>
                            <th colSpan={2}>Join</th>
                            <th>Column Script</th>
                            {columns.length > 1 ? <th>Final Script</th> : null}
                        </tr>
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}
