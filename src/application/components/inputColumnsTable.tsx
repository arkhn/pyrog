import * as React from "react";
import {Button, Card, ControlGroup, Divider, Elevation} from "@blueprintjs/core";

import StringSelect from '../components/selects/stringSelect'

import {IInputColumn} from '../types'

import {scriptList} from '../mockdata/scriptList'

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
                <td>{column.owner}</td>
                <td>{column.table}</td>
                <td>{column.column}</td>
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
                        {rows}
                    </tbody>
                </table>
            </div>
        );
    }
}
