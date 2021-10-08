// import { aqlstr, getOneResult } from '../../../../lib/helpers/arango/query'
// import { ByAuthIdAdapter } from '../../../../ports/content-graph/profile'
// import { getProfileByAuthIdQ } from '../aql/queries/__getProfileByAuthId'
// import { ContentGraphDB } from '../types'

// export const getByAuthId = (db: ContentGraphDB): ByAuthIdAdapter => ({
//   async getProfileByAuthId({ authId }) {
//     const q = getProfileByAuthIdQ({ authIdVar: aqlstr(authId) })
//     const profile = await getOneResult(q, db)
//     return profile
//   },
// })
