import { IToastProps } from '@blueprintjs/core'
import { ISimpleAction } from '../types'

const initialState: IToastProps[] = []

export const toastsProps = (state = initialState, action: ISimpleAction): any => {
    switch (action.type) {
        case 'ADD_TOAST': {
            return [
                ...state,
                {
                    ...action.payload.props
                }
            ]
        }

        default:
            return state
    }
}

export default toastsProps
