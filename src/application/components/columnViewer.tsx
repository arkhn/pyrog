import * as React from "react";
import {Button, Card, ControlGroup, Divider, Elevation} from "@blueprintjs/core";

import StringSelect from '../components/selects/stringSelect'

import {IInputColumn} from '../types'

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

        let cards = columns ? columns.map((column: IInputColumn, index: number) =>
            <Card
                interactive={true}
                elevation={Elevation.ONE}
                key={index}
            >
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
            </Card>
        ) : []

        return (
            <div>
                {cards}
            </div>
        );
    }
}
