import { objectType } from 'nexus'

export const Credential = objectType({
  name: 'Credential',
  definition(t) {
    t.model.id()

    t.model.host()
    t.model.port()
    t.model.database()
    t.model.model()

    t.model.login()
    t.model.password()

    t.model.source()
  },
})
