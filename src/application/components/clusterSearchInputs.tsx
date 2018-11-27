import * as React from "react";
import {ControlGroup, InputGroup, Switch} from '@blueprintjs/core';

import StringSelect from './selects/stringSelect'

import {clusterLabels} from '../mockdata/clusters'

export interface IProps {

}

export interface IState {

}

export default class ClusterSearchInputs extends React.Component<IProps, IState> {
    public render() {
        return (
            <div id={'text-tab-search-group'}>
                <div className={'row center-flex'}>
                    <StringSelect
                        inputItem={''}
                        items={clusterLabels}
                        icon={'layout-auto'}
                        onChange={null}
                    />
                </div>
            </div>
        );
    }
}
