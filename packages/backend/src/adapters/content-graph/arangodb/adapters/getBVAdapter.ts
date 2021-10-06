import { GetBV } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import { getOneResult } from '../../../../lib/helpers/arango/query'
import { aqBV } from '../aql/helpers'
import { ContentGraphDB } from '../types'

export const getBVAdapter = (db: ContentGraphDB) => {
  const getBV: GetBV = val => {
    const q = aqBV(val)
    // console.log(`getBV:\n${q}`)
    return getOneResult(q, db) as any
  }
  return getBV
}
