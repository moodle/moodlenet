import { getOneResult } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { adapter } from '../../../../../ports/content-graph/node/add'
import { addNodeQ } from '../../aql/writes/addNode'
import { ContentGraphDB } from '../../types'

export const arangoAddNodeAdapter =
  (db: ContentGraphDB): SockOf<typeof adapter> =>
  async ({ node, assertions }) => {
    type NT = typeof node._type
    const q = addNodeQ<NT>({ node, assertions })
    const result = await getOneResult(q, db)

    return result as any
  }
