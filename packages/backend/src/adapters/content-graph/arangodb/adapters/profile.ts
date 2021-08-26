import { aqlstr, getOneResult } from '../../../../lib/helpers/arango/query'
import { ByAuthIdAdapter } from '../../../../ports/content-graph/profile'
import { aqlGraphNode2GraphNode } from '../aql/helpers'
import { getProfileByAuthIdQ } from '../aql/queries/getProfileByAuthId'
import { ContentGraphDB } from '../types'

export const getByAuthId = (db: ContentGraphDB): ByAuthIdAdapter => ({
  async getProfileByAuthId({ authId }) {
    const q = getProfileByAuthIdQ({ authIdVar: aqlstr(authId) })
    const mAqlProfile = await getOneResult(q, db)
    if (!mAqlProfile) {
      return mAqlProfile
    }
    return aqlGraphNode2GraphNode(mAqlProfile)
  },
})
