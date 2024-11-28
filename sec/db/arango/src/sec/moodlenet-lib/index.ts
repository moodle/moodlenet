import { unreachable_never } from '@moodle/lib-types'
import { moodlenetContributorIdSelect, moodlenetContributorRecord } from '@moodle/module/moodlenet'
import { aql } from 'arangojs'
import { AqlQuery, literal } from 'arangojs/aql'
import { dbStruct } from '../../db-structure'
import { overUserProfileById } from '../user-profile-db'

export async function overMoodlenetContributor({
  dbStruct,
  select,
  apply = aql``,
  returns = 'moodlenetContributorDoc',
}: {
  apply?: AqlQuery
  dbStruct: dbStruct
  select: moodlenetContributorIdSelect
  returns?: 'moodlenetContributorDoc' | 'OLD' | 'NEW'
}): Promise<moodlenetContributorRecord | null> {
  const filter_id =
    select.by === 'moodlenetContributorId'
      ? aql`moodlenetContributorDoc._key == ${select.moodlenetContributorId}`
      : (userProfileId => (userProfileId ? aql`moodlenetContributorDoc.userProfile.id == ${userProfileId}` : null))(
          await (select.by === 'userAccountId'
            ? overUserProfileById({ dbStruct, userProfileIdSelect: select }).then(mProfileRecord => mProfileRecord?.id)
            : select.by === 'userProfileId'
              ? select.userProfileId
              : unreachable_never(select)),
        )
  if (!filter_id) {
    return null
  }
  const cursor = await dbStruct.appData.db.query(aql<moodlenetContributorRecord>`
      FOR moodlenetContributorDoc IN ${dbStruct.appData.coll.contributor}
      FILTER ${filter_id}
      LIMIT 1
      ${apply}
      return MOODLE::RESTORE_RECORD_ID(${literal(returns)})
    `)

  const [m_moodlenetContributorRecord] = await cursor.all()
  return m_moodlenetContributorRecord ?? null
}

// export async function updateMoodlenetContributor({
//   dbStruct,
//   select,
//   partialMoodlenetContributorRecord,
// }: {
//   select: moodlenetContributorIdSelect
//   dbStruct: dbStruct
//   partialMoodlenetContributorRecord: deep_partial_props<moodlenetContributorRecord>
// }) {
//   return getMoodlenetContributor({
//     apply: aql`UPDATE moodlenetContributorDoc WITH ${partialMoodlenetContributorRecord} IN ${dbStruct.appData.coll.contributor}`,
//     dbStruct,
//     select,
//   })
// }
