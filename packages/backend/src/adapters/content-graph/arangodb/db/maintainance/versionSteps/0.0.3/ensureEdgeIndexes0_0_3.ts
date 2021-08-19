import { EdgeCollection } from 'arangojs/collection'
import { ensureEdgeIndexes_0_0_2 } from '../0.0.2/ensureEdgeIndexes0_0_2'

export const ensureEdgeIndexes_0_0_3 = async (edgeCollection: EdgeCollection) => {
  return ensureEdgeIndexes_0_0_2(edgeCollection)
}
