import { objectType } from 'nexus'

export const Resource = objectType({
  name: 'Resource',
  definition(t) {
    t.model.id()

    t.model.label()
    t.model.fhirType()

    t.model.primaryKeyOwner()
    t.model.primaryKeyTable()
    t.model.primaryKeyColumn()

    t.model.attributes()
    t.model.source()

    t.model.updatedAt()
    t.model.createdAt()
  },
})
