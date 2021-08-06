import { edgeTypes } from '@moodlenet/common/lib/content-graph/types/edge'
import { nodeTypes } from '@moodlenet/common/lib/content-graph/types/node'
import { Database } from 'arangojs'

export const createDBCollections = async ({ db }: { db: Database }) => {
  console.log(`creating node collections`)
  await Promise.all(
    nodeTypes.map(async nodeCollName => {
      const collection = await db.createCollection(nodeCollName)
      console.log(`created node collection ${nodeCollName}`)
      await collection.ensureIndex({
        type: 'persistent',
        unique: true,
        name: 'slug',
        fields: ['_slug'],
      })

      if (nodeCollName === 'Profile') {
        await collection.ensureIndex({
          type: 'persistent',
          unique: true,
          name: 'authId',
          fields: ['_authId'],
        })
      }

      if (nodeCollName === 'Language') {
        await collection.ensureIndex({
          type: 'persistent',
          unique: true,
          name: 'name',
          fields: ['name'],
        })
        await collection.ensureIndex({
          type: 'persistent',
          unique: true,
          name: 'part1',
          sparse: true,
          fields: ['part1'],
        })
      }

      if (
        nodeCollName === 'IscedField' ||
        nodeCollName === 'IscedGrade' ||
        nodeCollName === 'FileFormat' ||
        nodeCollName === 'ResourceType'
      ) {
        await collection.ensureIndex({
          type: 'persistent',
          unique: true,
          name: 'code',
          fields: ['code'],
        })

        if (nodeCollName === 'IscedField' || nodeCollName === 'IscedGrade') {
          await collection.ensureIndex({
            type: 'persistent',
            name: 'codePath',
            fields: ['codePath[*]'],
          })
        }
      }

      return collection
    }),
  )
  console.log(`creating edge collections`)
  await Promise.all(
    edgeTypes.map(async edgeCollName => {
      console.log(`creating edge collection ${edgeCollName}`)
      const edgeCollection = await db.createEdgeCollection(edgeCollName)

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

      return edgeCollection
    }),
  )
}
