import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { moodlenetContributorRecord } from '@moodle/module/moodlenet'
import { aql } from 'arangojs'
import { dbStruct } from '../db-structure'
import { save_id_to_key } from '../lib/key-id-mapping'
import { overMoodlenetContributor } from './moodlenet-lib'

export function moodlenet_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return (/* secondaryCtx */) => {
    const secondaryAdapter: secondaryAdapter = {
      moodlenet: {
        query: {
          async contributor({ select, filter: { accessLevel } }) {
            const moodlenetContributorRecord = await overMoodlenetContributor({ dbStruct, select })

            return moodlenetContributorRecord && (!accessLevel || accessLevel.includes(moodlenetContributorRecord.access))
              ? [true, { moodlenetContributorRecord }]
              : [false, { reason: 'notFound' }]
          },
          async contributors({ range: [limit, skip = 0], sort = [] /* , filters */ }) {
            const [sortBy, sortDir = 'ASC'] = sort
            const sortByMap: Record<(typeof sort)[0] & string, string> = {
              points: 'moodlenetContributorDoc.stats.points',
            }
            // const aqlFilters = filters
            //   .map(filter => {
            //     const filters = {
            //       access: ({ accessLevel }: d_u__d<queryContributorFilter, 'type', 'access'>) =>
            //         aql`FILTER moodlenetContributorDoc.access IN ${accessLevel}`,
            //     }
            //     return filters[filter.type](filter)
            //   })
            //   .join('\n')

            const aqlSort = !sortBy ? '' : aql`SORT ${sortByMap[sortBy]} ${sortDir}`
            const cursor = await dbStruct.appData.db.query(aql<moodlenetContributorRecord>`
                FOR moodlenetContributorDoc IN ${dbStruct.appData.coll.contributor}
                FILTER moodlenetContributorDoc.access == 'public'
                ${aqlSort}
                LIMIT ${skip},${limit}
                // contributors
                RETURN MOODLE::RESTORE_RECORD_ID(moodlenetContributorDoc)
              `)
            const moodlenetContributorRecords = await cursor.all()
            return { moodlenetContributorRecords }
          },
        },
        write: {
          async createMoodlenetContributor({ moodlenetContributorRecord }) {
            dbStruct.appData.coll.contributor.save(save_id_to_key('id')(moodlenetContributorRecord)).catch(() => null)
            return
          },
          async updateMoodlenetContributorAccess({ access, select }) {
            await overMoodlenetContributor({
              dbStruct,
              select,
              apply: aql`UPDATE moodlenetContributorDoc WITH { access: ${access} } IN ${dbStruct.appData.coll.contributor}`,
            })
          },
          async updateMoodlenetContributorProfileInfoMeta({ lastEditDate, profileInfoMeta, select }) {
            await overMoodlenetContributor({
              dbStruct,
              select,
              apply: aql`UPDATE moodlenetContributorDoc WITH  {
                                                                userProfile:{
                                                                  info: ${{
                                                                    lastEditDate,
                                                                    ...profileInfoMeta,
                                                                  }}
                                                                }
                                                              } IN ${dbStruct.appData.coll.contributor}`,
            })
          },
          async updateMoodlenetContributorProfileInfoImage({ lastEditDate, type, image, select }) {
            await overMoodlenetContributor({
              dbStruct,
              select,
              apply: aql`REPLACE MERGE_RECURSIVE(moodlenetContributorDoc, {
                                                                            userProfile:{
                                                                              info:{
                                                                                [${type}]: null
                                                                              }
                                                                            }
                                                                          },{
                                                                            userProfile:{
                                                                              info:{
                                                                                lastEditDate: ${lastEditDate},
                                                                                [${type}]: ${image}
                                                                              }
                                                                            }
                                                                          }) IN ${dbStruct.appData.coll.contributor}`,
            })
          },
        },
        // service: secondaryCtx.mod.secondary.env.service,
        // queue: secondaryCtx.mod.secondary.env.queue,
        // write: secondaryCtx.mod.secondary.env.write,
        // sync: secondaryCtx.mod.env
      },
    }
    return secondaryAdapter
  }
}
