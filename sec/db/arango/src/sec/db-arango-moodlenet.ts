import { secondaryAdapter, secondaryProvider } from '@moodle/domain'
import { moodlenetContributorRecord } from '@moodle/module/moodlenet'
import { aql } from 'arangojs'
import { dbStruct } from '../db-structure'
import { restore_maybe_record, RESTORE_RECORD_AQL } from '../lib/key-id-mapping'
import { getUserProfileByUserAccountId } from './user-profile-db'

export function moodlenet_secondary_factory({ dbStruct }: { dbStruct: dbStruct }): secondaryProvider {
  return secondaryCtx => {
    const secondaryAdapter: secondaryAdapter = {
      moodlenet: {
        query: {
          async contributor(select) {
            const moodlenetContributorRecord = await (async () => {
              if (select.by === 'moodlenetContributorId') {
                return dbStruct.moodlenet.coll.contributor
                  .document({ _key: select.moodlenetContributorId })
                  .then(restore_maybe_record)
              } else {
                const userProfileRecordId = await (
                  select.by === 'userAccountId'
                    ? getUserProfileByUserAccountId({ dbStruct, userAccountId: select.userAccountId })
                    : dbStruct.userAccount.coll.userProfile
                        .document({ _key: select.userProfileId })
                        .then(restore_maybe_record)
                ).then(userProfileRecord => userProfileRecord?.id)
                const cursor = await dbStruct.moodlenet.db.query(aql<moodlenetContributorRecord>`
                  FOR moodlenetContributorDoc IN ${dbStruct.moodlenet.coll.contributor}
                  FILTER moodlenetContributorDoc.userProfile.id == ${userProfileRecordId}
                  LIMIT 1
                  return ${RESTORE_RECORD_AQL('moodlenetContributorDoc')}
                `)
                const [m_moodlenetContributorRecord] = await cursor.all()
                return m_moodlenetContributorRecord
              }
            })()
            return moodlenetContributorRecord ? [true, { moodlenetContributorRecord }] : [false, { reason: 'notFound' }]
          },
          async contributors({ range: [limit, skip = 0], sort = [] }) {
            const [sortBy, sortDir = 'ASC'] = sort
            const sortByMap: Record<(typeof sort)[0] & string, string> = {
              points: 'moodlenetContributorDoc.stats.points',
            }
            const aqlSort = !sortBy ? '' : aql`SORT ${sortByMap[sortBy]} ${sortDir}`
            const cursor = await dbStruct.moodlenet.db.query(aql<moodlenetContributorRecord>`
                FOR moodlenetContributorDoc IN ${dbStruct.moodlenet.coll.contributor}
                ${aqlSort}
                LIMIT ${skip},${limit}
                return ${RESTORE_RECORD_AQL('moodlenetContributorDoc')}
              `)
            const moodlenetContributorRecords = await cursor.all()
            return { moodlenetContributorRecords }
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
