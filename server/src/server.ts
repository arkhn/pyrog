import { GraphQLServer, Options } from 'graphql-yoga'

import { permissions } from 'permissions'
import register from 'rest'

import { schema } from './schema'
import { createContext } from './context'
import { bootstrapDefinitions } from 'fhir'

const server = new GraphQLServer({
  schema,
  context: createContext,
  middlewares: [permissions],
})

register(server.express)

const options: Options = {
  cors: false,
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
