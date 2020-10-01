import { GraphQLServer, Options } from 'graphql-yoga'
import cors from 'cors'
import axios from 'axios'

import {
  authenticationError,
  authorizationError,
  permissions,
} from 'permissions'

import { schema } from './schema'
import { createContext } from './context'
import { bootstrapDefinitions } from './fhir'
import { authClient } from './oauth'
import { ENV } from './constants'

// AXIOS

// Set a default authentication header for fhir api calls
const setAccessToken = async () => {
  const fhirApiToken = await authClient.credentials.getToken()
  axios.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${fhirApiToken.accessToken}`
}

const server = new GraphQLServer({
  schema,
  context: createContext,
  middlewares: [permissions],
})

server.express.use(cors())

const options: Options = {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  },
  bodyParserOptions: { limit: '10mb', type: 'application/json' },
  formatError: (err: any) => {
    if (err.message.startsWith(authenticationError.code)) {
      return {
        message: err.message,
        statusCode: authenticationError.statusCode,
      }
    } else if (err.message.startsWith(authorizationError.code)) {
      return {
        message: err.message,
        statusCode: authorizationError.statusCode,
      }
    } else {
      return err
    }
  },
}
const { PORT } = process.env

const main = async () => {
  if (!(ENV && ENV === 'test')) {
    await setAccessToken()
  }
  await bootstrapDefinitions()
  server.start(options, () =>
    console.log(
      `🚀 Server ready at: http://localhost:${PORT || 4000}
      \n⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️`,
    ),
  )
}

main()
