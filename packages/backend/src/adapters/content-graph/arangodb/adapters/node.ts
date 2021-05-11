import { Database } from 'arangojs'
import { ByIdAdapter, CreateAdapter } from '../../../../ports/content-graph/node'
import { createNodeQ } from '../functions/createNode'
import { getNode } from '../functions/getNode'
import { getOneResult } from '../functions/helpers'

export const getNodeByIdAdapter = (db: Database): ByIdAdapter => ({
  getNodeById: async ({ _key, nodeType, assertions }) => {
    const q = getNode({ _key, nodeType, assertions })
    return getOneResult(q, db)
  },
})

export const createNodeAdapter = (db: Database): CreateAdapter => ({
  storeNode: async ({ assertions, data, nodeType, key, creatorProfileId }) => {
    const q = createNodeQ({ assertions, creatorProfileId, data, nodeType, key })
    return getOneResult(q, db)
  },
})
