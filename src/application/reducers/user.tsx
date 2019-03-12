import { ISimpleAction } from '../types'

const initialState: any = {
    isAuthenticated: false,
    info: {
        id: null,
        email: null,
        name: null,
    }
}

export const user = (state = initialState, action: ISimpleAction): any => {
    switch (action.type) {
        case 'LOGIN': {
            return {
                ...state,
            }
        }

        default:
            return state
    }
}

export default user
