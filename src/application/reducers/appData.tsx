import {
    ISimpleAction,
    IReduxAppData
} from '../types'

const initialState: IReduxAppData = {
    distantServerUrl: 'http://localhost:3000',
    testState: true,
    dialogIsOpen: false,
}

export const appData = (state = initialState, action: ISimpleAction): IReduxAppData => {
    switch (action.type) {
        default:
            return state
    }
}
