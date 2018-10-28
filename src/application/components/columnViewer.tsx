import * as React from "react";
import {Button, Card, ControlGroup, Divider, Elevation} from "@blueprintjs/core";

import StringSelect from '../components/selects/stringSelect'

import {IInputColumn} from '../types'

import {scriptList} from '../mockdata/scriptList'

export interface IColumnViewerProps {
    columns: IInputColumn[];
    currentOwnerList: string[];
    currentTableList: string[];
    currentColumnList: string[];
    dispatch: any;
}

export interface IColumnViewerState {

}

export default class ColumnViewer extends React.Component<IColumnViewerProps, IColumnViewerState> {
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
                <td>
                    <ControlGroup fill={false} vertical={false}>
                        <StringSelect
                            inputItem={column.owner}
                            items={currentOwnerList}
                            icon={'group-objects'}
                            action={null}
                            dispatch={dispatch}
                        />
                        <StringSelect
                            inputItem={column.table}
                            items={currentTableList}
                            icon={'th'}
                            action={null}
                            dispatch={dispatch}
                        />
                        <StringSelect
                            inputItem={column.column}
                            items={currentColumnList}
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
                {index == 0 ?
                    <td rowSpan={columns.length}>
                        <StringSelect
                            inputItem={null}
                            items={scriptList}
                            icon={'function'}
                            action={null}
                            dispatch={dispatch}
                        />
                    </td>
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
