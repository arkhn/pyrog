import { Query } from './Query'
import { Subscription } from './Subscription'
import { auth } from './Mutation/auth'
import { arkhn } from './Mutation/arkhn'

export default {
    Query,
    Mutation: {
        ...auth,
        ...arkhn,
    },
    Subscription,
}
