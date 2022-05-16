import { getOneResult } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { adapter } from '../../../../../ports/system/localOrg/node'
import { getNodesByExampleQ } from '../../aql/queries/getNodeByExample'
import { ContentGraphDB } from '../../types'

export const arangoLocalOrgNodeAdapter =
  (db: ContentGraphDB): SockOf<typeof adapter> =>
  async () => {
    const q = getNodesByExampleQ({ nodeType: 'Organization', ex: { _local: true } })
    const result = await getOneResult(q, db)
    if (!result) {
      throw new Error(`arangoLocalOrgNodeAdapter: Couldn't find Local Organization!`)
    }
    return result
  }
