import { edgeTypeFromId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Database } from 'arangojs'
import { QMDeployer } from '../../../../lib/qmino/types'
import { create, CreateAdapter, del, DeleteAdapter } from '../../../../ports/content-graph/edge'
import { createEdgeQ } from '../functions/createEdge'
import { deleteEdgeQ } from '../functions/deleteEdge'
import { getOneResult } from '../functions/helpers'

export const createEdgeAdapter = (db: Database): QMDeployer<typeof create> => [
  (action /* , args, port */) => {
    // return port(...args)({
    const storeEdge: CreateAdapter['storeEdge'] = async ({
      assertions,
      data,
      edgeType,
      creatorProfileId,
      from,
      to,
    }) => {
      const q = createEdgeQ({ assertions, creatorProfileId, data, edgeType, from, to })
      return getOneResult(q, db)
    }
    return action({
      storeEdge,
    })
  },
  async () => {},
]

export const deleteEdgeAdapter = (db: Database): QMDeployer<typeof del> => [
  (action /* , args, port */) => {
    // return port(...args)({
    const deleteEdge: DeleteAdapter['deleteEdge'] = async ({ assertions, edgeType, deleterProfileId, edgeId }) => {
      //FIXME: lost typings here : allows to return anything
      if (edgeType !== edgeTypeFromId(edgeId)) {
        return 'NotFound'
      }
      const q = deleteEdgeQ({ deleterProfileId, edgeId, edgeType, assertions })

      const result = await getOneResult(q, db)

      if (!result) {
        return 'NotFound'
      }

      return result
    }
    return action({
      deleteEdge,
    })
  },
  async () => {},
]
