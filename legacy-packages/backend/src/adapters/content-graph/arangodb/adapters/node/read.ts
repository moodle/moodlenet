import { getOneResult } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { Adapter } from '../../../../../ports/content-graph/node/read'
import { readNodeQ } from '../../aql/queries/readNode'
import { ContentGraphDB } from '../../types'

export const arangoReadNodeAdapter =
  (db: ContentGraphDB): SockOf<Adapter> =>
  async ({ nodeId, assertions }) => {
    const q = readNodeQ({ nodeId, assertions })

    const result = await getOneResult(q, db)
    return result as any
  }
