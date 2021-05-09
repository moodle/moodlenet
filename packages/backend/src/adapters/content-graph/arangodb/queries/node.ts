import { Database } from 'arangojs'
import { QMDeployer } from '../../../../lib/qmino/types'
import { byId } from '../../../../ports/queries/content-graph/get-content-node'
import { getNode } from '../lib/getNode'
import { getOneResult } from '../lib/helpers'

export const getNodeByIdArangoAdapter = (db: Database): QMDeployer<typeof byId> => [
  (action /* , args, port */) => {
    // return port(...args)({
    return action({
      getNodeById: async ({ _key, nodeType, assertions }) => {
        const q = getNode({ _key, nodeType, assertions })
        return getOneResult(q, db)
      },
    })
  },
  async () => {},
]
