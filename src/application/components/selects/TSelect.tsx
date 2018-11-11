import * as React from 'react'
import {Button, MenuItem, Intent} from "@blueprintjs/core";
import {Select, ItemPredicate, ItemRenderer} from "@blueprintjs/select";
import {IconName} from '@blueprintjs/icons';

interface ISelectProps<T> {
    items: T[];
    inputItem: T;
    renderItem: ItemRenderer<T>;
    filterItems: ItemPredicate<T>;
    displayItem: (item: any) => string;
    icon: IconName;
    intent?: Intent;
    onChange: any;
    dispatch?: any;
};

export default class TSelect<T> extends React.Component<ISelectProps<T>, any> {
    constructor(props: ISelectProps<T>) {
        super(props);
    }

    private CustomSelect = Select.ofType<T>();

    private handleValueChange = (item: T) => {
        if (this.props.dispatch) {
            this.props.dispatch(this.props.onChange(item))
        } else {
            this.props.onChange(item)
        }
    }

    public render () {
        const {items, inputItem, intent} = this.props;

        return (
            <div>
                <this.CustomSelect
                    items={items}
                    itemPredicate={this.props.filterItems}
                    itemRenderer={this.props.renderItem}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onItemSelect={this.handleValueChange}
                >
                    <Button
                        icon={this.props.icon}
                        rightIcon="caret-down"
                        text={this.props.displayItem(inputItem)}
                        intent={intent ? intent : null}
                    />
                </this.CustomSelect>
            </div>
        )
    }
}
