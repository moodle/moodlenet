import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { moodlenetContributorRecord } from '@moodle/module/moodlenet'
import { aql } from 'arangojs'
import { dbStruct } from '../db-structure'
import { save_id_to_key } from '../lib/key-id-mapping'
import { getMoodlenetContributor, updateMoodlenetContributor } from './moodlenet-db'

export function moodlenet_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return secondaryCtx => {
    const secondaryAdapter: secondaryAdapter = {
      moodlenet: {
        query: {
          async contributor({ select, noAccessLevelFilter }) {
            const moodlenetContributorRecord = await getMoodlenetContributor({ dbStruct, select })

            return moodlenetContributorRecord &&
              (noAccessLevelFilter || moodlenetContributorRecord.access.level === 'public')
              ? [true, { moodlenetContributorRecord }]
              : [false, { reason: 'notFound' }]
          },
          async contributors({ range: [limit, skip = 0], sort = [] }) {
            const [sortBy, sortDir = 'ASC'] = sort
            const sortByMap: Record<(typeof sort)[0] & string, string> = {
              points: 'moodlenetContributorDoc.stats.points',
            }
            const aqlSort = !sortBy ? '' : aql`SORT ${sortByMap[sortBy]} ${sortDir}`
            const cursor = await dbStruct.moodlenet.db.query(aql<moodlenetContributorRecord>`
                FOR moodlenetContributorDoc IN ${dbStruct.moodlenet.coll.contributor}
                FILTER moodlenetContributorDoc.access.level == 'public'
                ${aqlSort}
                LIMIT ${skip},${limit}
                return MOODLE::RESTORE_RECORD(moodlenetContributorDoc)
              `)
            const moodlenetContributorRecords = await cursor.all()
            return { moodlenetContributorRecords }
          },
        },
        write: {
          async createMoodlenetContributor({ moodlenetContributorRecord }) {
            dbStruct.moodlenet.coll.contributor.save(save_id_to_key(moodlenetContributorRecord)).catch(() => null)
            return
          },
          async updatePartialMoodlenetContributor({ partialMoodlenetContributorRecord, select }) {
            await updateMoodlenetContributor({
              dbStruct,
              select,
              partialMoodlenetContributorRecord,
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
