import { getOneResult } from '../../../../lib/helpers/arango/query'
import { ByAuthIdAdapter } from '../../../../ports/content-graph/profile'
import { getProfileByAuthIdQ } from '../functions/getProfileByAuthId'
import { aqlGraphNode2GraphNode } from '../functions/helpers'
import { ContentGraphDB } from '../types'

export const getByAuthId = (db: ContentGraphDB): ByAuthIdAdapter => ({
  async getProfileByAuthId({ authId }) {
    const q = getProfileByAuthIdQ({ authId })
    const mAqlProfile = await getOneResult(q, db)
    if (!mAqlProfile) {
      return mAqlProfile
    }
    return aqlGraphNode2GraphNode(mAqlProfile)
  },
})
