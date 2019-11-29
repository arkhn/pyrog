import { objectType } from 'nexus'

export const Join = objectType({
  name: 'Join',
  definition(t) {
    t.model.id()

    t.model.sourceOwner()
    t.model.sourceTable()
    t.model.sourceColumn()
    t.model.targetOwner()
    t.model.targetTable()
    t.model.targetColumn()

    t.model.inputColumn()

    t.model.updatedAt()
    t.model.createdAt()
  },
})
