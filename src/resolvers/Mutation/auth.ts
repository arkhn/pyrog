import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { Context } from '../../utils'

export const auth = {
    async signup(parent, args, context: Context) {
        const password = await bcrypt.hash(args.password, 10)
        const user = await context.client.createUser({
            ...args,
            password,
        })

        return {
            token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
            user,
        }
    },

    async login(parent, { email, password }, context: Context) {
        const user = await context.client.user({ email })
        if (!user) {
            throw new Error(`No such user found for email: ${email}`)
        }

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            throw new Error('Invalid password')
        }

        return {
            token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
            user,
        }
    },
}
