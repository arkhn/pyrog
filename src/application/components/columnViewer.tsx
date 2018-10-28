import * as React from 'react';
import {ControlGroup, InputGroup, Switch} from '@blueprintjs/core';

export interface IColumnViewerProps {
    dispatch: any;
    data: any;
}

export interface IColumnViewerState {

}

export default class ColumnViewer extends React.Component<IColumnViewerProps, IColumnViewerState> {
    public render() {
        let {data, dispatch} = this.props

        let columns = data.map((column: any) =>
            <div className={'column'}>
                <div className={'column-header'}>
                    <div>{column.owner}</div>
                    <div>{column.table}</div>
                    <div>{column.column}</div>
                </div>
                <div className={'column-rows'}>
                    {column.rows.map((row: string) =>
                        <div>{row}</div>
                    )}
                </div>
            </div>
        )

        return (
            <div className={'column-viewer'}>
                <div className={'column-flexbox'}>
                    {columns}
                </div>
            </div>
        );
    }
}
