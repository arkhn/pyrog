import { inputObjectType } from 'nexus'

export const JoinInput = inputObjectType({
  name: 'JoinInput',
  definition(t) {
    t.string('source')
    t.string('target')
  },
})
