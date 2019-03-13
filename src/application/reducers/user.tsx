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
                isAuthenticated: true,
                info: {
                    id: action.payload.id,
                    email: action.payload.email,
                    name: action.payload.name,
                }
            }
        }

        case 'LOGOUT': {
            return {
                ...state,
                ...initialState,
            }
        }

        default:
            return state
    }
}

export default user
