import { unreachable_never } from '@moodle/lib-types'
import { moodlenetContributorIdSelect, moodlenetContributorRecord } from '@moodle/module/moodlenet'
import { aql } from 'arangojs'
import { AqlQuery, literal } from 'arangojs/aql'
import { dbStruct } from '../../db-structure'
import { getMaybeUserProfileByIdSelectAql } from '../user-profile-db'

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
  const getMaybeContributorAql = getMaybeContributorByIdSelectAql(select, dbStruct)
  const cursor = await dbStruct.appData.db.query(aql<moodlenetContributorRecord>`
      LET moodlenetContributorDoc = ${getMaybeContributorAql}
      FILTER moodlenetContributorDoc != null
      ${apply}
      // overMoodlenetContributor
      RETURN MOODLE::RESTORE_RECORD_ID(${literal(returns)})
    `)

  const [m_moodlenetContributorRecord] = await cursor.all()
  return m_moodlenetContributorRecord ?? null
}

function getMaybeContributorByIdSelectAql(select: moodlenetContributorIdSelect, dbStruct: dbStruct) {
  return select.by === 'moodlenetContributorId'
    ? aql`(DOCUMENT(${dbStruct.appData.coll.contributor}, ${select.moodlenetContributorId}))`
    : select.by === 'userAccountId' || select.by === 'userProfileId'
      ? aql`( ( FOR userProfileDoc IN [${getMaybeUserProfileByIdSelectAql(select, dbStruct)}]
                  FILTER userProfileDoc != null
                  RETURN ( FOR moodlenetContributorDoc IN ${dbStruct.appData.coll.contributor}
                    FILTER moodlenetContributorDoc.userProfile.id == userProfileDoc._key
                    LIMIT 1
                    RETURN moodlenetContributorDoc )[0]
              )[0])
        `
      : unreachable_never(select)
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
