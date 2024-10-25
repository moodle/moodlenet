import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { dbStruct } from '../db-structure'
import { aql } from 'arangojs'
import { userProfileDocument, userProfileDocument2userProfileRecord } from './user-profile-db'
import { userProfileDocument2ContributorInfo } from './db-arango-moodlenet/mappings'

export function moodlenet_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return secondaryCtx => {
    const secondaryAdapter: secondaryAdapter = {
      moodlenet: {
        query: {
          async contributors({ limit = 100, skip = 0, sort = [] }) {
            // const userProfile:userProfileDocument
            // userProfile.appData.moodlenet.points.amount
            const [sortBy, sortDir = 'ASC'] = sort
            const sortByMap: Record<(typeof sort)[0] & string, string> = {
              points: 'userProfile.appData.moodlenet.points.amount',
            }
            const aqlSort = !sortBy ? '' : aql`SORT ${sortByMap[sortBy]} ${sortDir}`
            const cursor = await dbStruct.data.db.query(aql<userProfileDocument>`
                FOR userProfile IN ${dbStruct.data.coll.userProfile}
                ${aqlSort}
                LIMIT ${skip},${limit}
                return userProfile
              `)
            const contributors = (await cursor.all()).map(userProfileDocument2ContributorInfo)
            return { contributors }
          },
        },
        // service: secondaryCtx.mod.env.service,
        // queue: secondaryCtx.mod.env.queue,
        // write: secondaryCtx.mod.env.write,
        // sync: secondaryCtx.mod.env
      },
    }
    return secondaryAdapter
  }
}
