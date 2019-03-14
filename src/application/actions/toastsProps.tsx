import { IToastProps } from '@blueprintjs/core'

import { IAction } from '../types'
import { INFO_URL } from '../constants'

export const addToast = (props: IToastProps): IAction => {
    return {
        type:'ADD_TOAST',
        payload: {
            props,
        }
    }
}
