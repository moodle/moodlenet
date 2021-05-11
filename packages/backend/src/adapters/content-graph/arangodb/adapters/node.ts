import { Database } from 'arangojs'
import { QMDeployer } from '../../../../lib/qmino/types'
import { byId, ByIdAdapter, create, CreateAdapter } from '../../../../ports/content-graph/node'
import { createNodeQ } from '../functions/createNode'
import { getNode } from '../functions/getNode'
import { getOneResult } from '../functions/helpers'

export const getNodeByIdAdapter = (db: Database): QMDeployer<typeof byId> => [
  (action /* , args, port */) => {
    // return port(...args)({
    const getNodeById: ByIdAdapter['getNodeById'] = async ({ _key, nodeType, assertions }) => {
      const q = getNode({ _key, nodeType, assertions })
      return getOneResult(q, db)
    }
    return action({
      getNodeById,
    })
  },
  async () => {},
]

export const createNodeAdapter = (db: Database): QMDeployer<typeof create> => [
  (action /* , args, port */) => {
    // return port(...args)({
    const storeNode: CreateAdapter['storeNode'] = async ({ assertions, data, nodeType, key, creatorProfileId }) => {
      const q = createNodeQ({ assertions, creatorProfileId, data, nodeType, key })
      return getOneResult(q, db)
    }
    return action({
      storeNode,
    })
  },
  async () => {},
]
