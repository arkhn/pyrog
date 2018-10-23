export default [
    function thunkMiddleware ({dispatch, getState}: any) {
        return function(next: any) {
            return function (action: any) {
                return action.promise ?
                    action.promise(dispatch, getState) :
                    next(action)
            }
        }
    },
]
