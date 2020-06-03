import { GraphQLServer, Options } from 'graphql-yoga'
import cors from 'cors'
import axios from 'axios'

import { permissions } from 'permissions'
import register from 'rest'

import { schema } from './schema'
import { createContext } from './context'
import { bootstrapDefinitions } from 'fhir'
import { JWT_TOKEN } from './constants'

// AXIOS

// Set a default authentication header for fhir api calls
axios.defaults.headers.common['Authorization'] = `Bearer ${JWT_TOKEN}`

const server = new GraphQLServer({
  schema,
  context: createContext,
  middlewares: [permissions],
})

server.express.use(cors())
register(server.express)

const options: Options = {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
  },
  bodyParserOptions: { limit: '10mb', type: 'application/json' },
}
const { PORT } = process.env

const main = async () => {
  await bootstrapDefinitions()
  await server.start(options, () =>
    console.log(
      `🚀 Server ready at: http://localhost:${PORT || 4000}
      \n⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️`,
    ),
  )
}

main()
