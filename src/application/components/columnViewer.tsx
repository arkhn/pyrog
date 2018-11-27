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

export interface IProps {
    data: any;
}

export interface IState {

}

export default class ColumnViewer extends React.Component<IProps, IState> {
    private handleClick = (column: any) => {
        return (event: any) => {
            // this.props.dispatch(clickAddInputColumn(column))
        }
    }

    public render() {
        let {data} = this.props

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
