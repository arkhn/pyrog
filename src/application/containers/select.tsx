import * as React from 'react'
import { Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";

// import * as Films from "./films";
import { filmSelectProps, IFilm, TOP_100_FILMS } from "./films";
import * as actions from '../actions'

const FilmSelect = Select.ofType<IFilm>();

export interface ISelectExampleState {
    film: IFilm;
};

export default class ResourceSelect extends React.Component<any, ISelectExampleState> {
    public state: ISelectExampleState = {
        film: TOP_100_FILMS[0],
    };

    constructor(props: any) {
        super(props)
    }

    sendFetchAction() {
        this.props.dispatch(actions.fetchFhirResource('test_backend/'))
    }

    private handleValueChange = (film: IFilm) => this.setState({ film });

    render () {
        const {film} = this.state;
        let {currentFhirResource, loading} = this.props
        let loadingMessage = loading ? <span>Loading...</span> : null

        return (
            <div>
                {loadingMessage}
                {/* <button onClick={() => this.sendFetchAction()}>Fetch Person</button> */}

                <FilmSelect
                    items={filmSelectProps.items}
                    itemPredicate={filmSelectProps.itemPredicate}
                    itemRenderer={filmSelectProps.itemRenderer}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onItemSelect={this.handleValueChange}
                >
                    <Button
                        icon="film"
                        rightIcon="caret-down"
                        text={film ? `${film.title} (${film.year})` : "(No selection)"}
                    />
                </FilmSelect>
            </div>
        )
    }
}
