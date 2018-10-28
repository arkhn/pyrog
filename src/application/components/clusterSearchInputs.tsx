import * as React from "react";
import {ControlGroup, InputGroup, Switch} from '@blueprintjs/core';

import StringSelect from './selects/stringSelect'

import {clusterLabels} from '../mockdata/clusters'

export interface IClusterSearchInputsProps {
    dispatch: any;
}

export interface IClusterSearchInputsState {

}

export default class ClusterSearchInputs extends React.Component<IClusterSearchInputsProps, IClusterSearchInputsState> {
    public render() {
        let {dispatch} = this.props

        return (
            <div id={'text-tab-search-group'}>
                <div className={'row center-flex'}>
                    <StringSelect
                        inputItem={''}
                        items={clusterLabels}
                        icon={'layout-auto'}
                        action={null}
                        dispatch={dispatch}
                    />
                </div>
            </div>
        );
    }
}
