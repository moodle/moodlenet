import { getOneResult } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { Adapter } from '../../../../../ports/content-graph/node/edit'
import { editNodeQ } from '../../aql/writes/editNode'
import { ContentGraphDB } from '../../types'
import { ARANGO_GRAPH_OPERATORS } from '../bl/graphOperators'

const { graphNode } = ARANGO_GRAPH_OPERATORS
export const arangoEditNodeAdapter =
  (db: ContentGraphDB): SockOf<Adapter> =>
  async ({ data, nodeId, assertions }) => {
    const q = editNodeQ({ data, nodeId: graphNode(nodeId), type: nodeId._type, assertions })

    const result = await getOneResult(q, db)

    return result as any
  }
