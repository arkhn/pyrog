export default [
    function thunkMiddleware ({dispatch, getState}: any) {
        return function(next: any) {
            return function (action: any) {
                return typeof action === 'function' ?
                    action(dispatch, getState) :
                    next(action)
            }
        }
    },
]
