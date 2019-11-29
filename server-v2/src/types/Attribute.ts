import { objectType } from 'nexus'

export const Attribute = objectType({
  name: 'Attribute',
  definition(t) {
    t.model.id()

    t.model.name()
    t.model.mergingScript()
    t.model.isProfile()
    t.model.model()
    t.model.comment()
    t.model.depth()

    t.model.resource()
    t.model.attributes()
    t.model.attribute()
    t.model.inputColumns()

    t.model.updatedAt()
    t.model.createdAt()
  },
})
