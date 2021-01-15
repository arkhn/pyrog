import axios from 'axios'
import { applyMiddleware } from 'graphql-middleware'

import {
  authenticationError,
  authorizationError,
  permissions,
} from 'permissions'

import { schema } from './schema'
import { createContext } from './context'
import { bootstrapDefinitions } from './fhir'
import { authClient } from './oauth'
import { IN_PROD } from './constants'
import { ApolloServer } from 'apollo-server'
import { GraphQLError, GraphQLFormattedError } from 'graphql'

// AXIOS
let accessToken: string | null = null

// Set a default authentication header for fhir api calls
const setAccessToken = async () => {
  const fhirApiToken = await authClient.credentials.getToken()
  accessToken = fhirApiToken.accessToken
}

if (IN_PROD) {
  // Set axios interceptor to use token
  axios.interceptors.request.use(config => {
    config.headers.Authorization =
      config.headers.Authorization || `Bearer ${accessToken}`
    return config
  })

  // Add an interceptor to ask for another access token when needed
  axios.interceptors.response.use(
    response => {
      return response
    },
    async error => {
      const originalRequest = error.config

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        await setAccessToken()
        return axios(originalRequest)
      }
      return Promise.reject(error)
    },
  )
}

const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: createContext,
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'IDToken'],
  },
  formatError: (err: GraphQLError): GraphQLFormattedError => {
    console.error(err)
    if (err.message.startsWith(authenticationError.code)) {
      return {
        message: err.message,
        extensions: {
          statusCode: authenticationError.statusCode,
        },
      }
    } else if (err.message.startsWith(authorizationError.code)) {
      return {
        message: err.message,
        extensions: {
          statusCode: authenticationError.statusCode,
        },
      }
    } else {
      return err
    }
  },
})

const { PORT } = process.env

const main = async () => {
  if (IN_PROD) {
    await setAccessToken()
  }
  await bootstrapDefinitions()
  server.listen({ port: PORT }, () =>
    console.log(
      `🚀 Server ready at: http://localhost:${PORT || 4000}
      \n⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️`,
    ),
  )
}

main()
