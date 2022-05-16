import { EdgeCollection } from 'arangojs/collection'

export const ensureEdgeIndexes = async (edgeCollection: EdgeCollection) => {
  await edgeCollection.ensureIndex({
    type: 'persistent',
    name: 'fromType',
    fields: ['_fromType'],
  })

  await edgeCollection.ensureIndex({
    type: 'persistent',
    name: 'toType',
    fields: ['_toType'],
  })

  await edgeCollection.ensureIndex({
    type: 'persistent',
    name: 'fromType-toType',
    fields: ['_fromType', '_toType'],
  })

  await edgeCollection.ensureIndex({
    type: 'persistent',
    name: 'from-toType',
    fields: ['_from', '_toType'],
  })

  await edgeCollection.ensureIndex({
    type: 'persistent',
    name: 'fromType-to',
    fields: ['_fromType', '_to'],
  })

  await edgeCollection.ensureIndex({
    type: 'persistent',
    unique: true,
    name: 'from-to',
    fields: ['_from', '_to'],
  })

  await edgeCollection.ensureIndex({
    type: 'persistent',
    name: 'fromType-from',
    fields: ['_fromType', '_from'],
  })

  await edgeCollection.ensureIndex({
    type: 'persistent',
    name: 'toType-to',
    fields: ['_toType', '_to'],
  })
}
