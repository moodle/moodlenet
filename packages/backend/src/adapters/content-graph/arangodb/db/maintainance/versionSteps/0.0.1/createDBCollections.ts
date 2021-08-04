import { edgeTypes } from '@moodlenet/common/lib/content-graph/types/edge'
import { nodeTypes } from '@moodlenet/common/lib/content-graph/types/node'
import { Database } from 'arangojs'

export const createDBCollections = async ({ db }: { db: Database }) => {
  await nodeTypes.map(async nodeCollName => {
    console.log(`creating node collection ${nodeCollName}`)
    const collection = await db.createCollection(nodeCollName)
    collection.ensureIndex({
      type: 'persistent',
      unique: true,
      name: '_slug',
      fields: ['_slug'],
    })

    if (nodeCollName === 'Profile') {
      collection.ensureIndex({
        type: 'persistent',
        unique: true,
        name: '_authId',
        fields: ['_authId'],
      })
    }

    if (nodeCollName === 'IscedField' || nodeCollName === 'IscedGrade') {
      collection.ensureIndex({
        type: 'persistent',
        unique: true,
        name: 'code',
        fields: ['code'],
      })
      collection.ensureIndex({
        type: 'persistent',
        unique: true,
        name: 'codePath',
        fields: ['codePath[*]'],
      })
    }

    return collection
  })
  await edgeTypes.map(async edgeCollName => {
    console.log(`creating edge collection ${edgeCollName}`)
    const edgeCollection = await db.createEdgeCollection(edgeCollName)

    edgeCollection.ensureIndex({
      type: 'persistent',
      name: '_fromType',
      fields: ['_fromType'],
    })

    edgeCollection.ensureIndex({
      type: 'persistent',
      name: '_toType',
      fields: ['_toType'],
    })

    edgeCollection.ensureIndex({
      type: 'persistent',
      name: '_formToType',
      fields: ['_toType', '_fromType'],
    })

    return edgeCollection
  })
}
