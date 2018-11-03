import * as React from 'react';
import {
    ControlGroup,
    Icon,
    InputGroup,
    Switch
} from '@blueprintjs/core';

import {
    clickAddInputColumn,
} from '../actions/mapping'

export interface IColumnViewerProps {
    dispatch: any;
    data: any;
}

export interface IColumnViewerState {

}

export default class ColumnViewer extends React.Component<IColumnViewerProps, IColumnViewerState> {
    private handleClick = (column: any) => {
        return (event: any) => {
            this.props.dispatch(clickAddInputColumn(column))
        }
    }

    public render() {
        let {data, dispatch} = this.props

        let columns = data.map((column: any, index: number) =>
            <div key={index}>
                <div
                    className={'add-button'}
                    onClick={this.handleClick(column)}
                >
                    <Icon icon={'plus'}/>
                </div>
                <div className={'column'}>
                    <div className={'column-header'}>
                        <div>{column.owner}</div>
                        <div>{column.table}</div>
                        <div>{column.column}</div>
                    </div>
                    <div className={'column-rows'}>
                        {column.rows.map((row: string, index: number) =>
                            <div key={index}>{row}</div>
                        )}
                    </div>
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
