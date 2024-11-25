import { _nullish, deep_partial_props } from '@moodle/lib-types'
import { moodlenetContributorIdSelect, moodlenetContributorRecord } from '@moodle/module/moodlenet'
import { aql } from 'arangojs'
import { AqlQuery } from 'arangojs/aql'
import { dbStruct } from '../../db-structure'
import { getUserProfileById } from '../user-profile-db'

export async function getMoodlenetContributor({
  dbStruct,
  select,
  apply = aql``,
}: {
  apply?: AqlQuery
  dbStruct: dbStruct
  select: moodlenetContributorIdSelect
}): Promise<moodlenetContributorRecord | _nullish> {
  const filter_id =
    select.by === 'moodlenetContributorId'
      ? aql`moodlenetContributorDoc._key == ${select.moodlenetContributorId}`
      : await getUserProfileById({ dbStruct, select }).then(mProfileRecord => {
          if (!mProfileRecord) {
            return
          }
          return aql`moodlenetContributorDoc.userProfile.id == ${mProfileRecord.id}`
        })

  if (!filter_id) {
    return
  }

  const cursor = await dbStruct.appData.db.query(aql<moodlenetContributorRecord>`
      FOR moodlenetContributorDoc IN ${dbStruct.appData.coll.contributor}
      FILTER ${filter_id}
      LIMIT 1
      ${apply}
      return MOODLE::RESTORE_RECORD_ID(moodlenetContributorDoc)
    `)

  const [m_moodlenetContributorRecord] = await cursor.all()
  return m_moodlenetContributorRecord
}

export async function updateMoodlenetContributor({
  dbStruct,
  select,
  partialMoodlenetContributorRecord,
}: {
  select: moodlenetContributorIdSelect
  dbStruct: dbStruct
  partialMoodlenetContributorRecord: deep_partial_props<moodlenetContributorRecord>
}) {
  return getMoodlenetContributor({
    apply: aql`UPDATE moodlenetContributorDoc WITH ${partialMoodlenetContributorRecord} IN ${dbStruct.appData.coll.contributor}`,
    dbStruct,
    select,
  })
}
