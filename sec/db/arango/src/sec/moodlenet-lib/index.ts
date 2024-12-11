import { unreachable_never } from '@moodle/lib-types'
import { moodlenetContributorIdSelect, moodlenetContributorRecord } from '@moodle/module/moodlenet'
import { aql } from 'arangojs'
import { AqlQuery, literal } from 'arangojs/aql'
import { dbStruct } from '../../db-structure'
import { getUserProfileByIdSelectAql } from '../user-profile-db'

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
  const getContributorAql = getContributorByIdSelectAql(select, dbStruct)
  if (!getContributorAql) {
    return null
  }
  const cursor = await dbStruct.appData.db.query(aql<moodlenetContributorRecord>`
      ${getContributorAql}
      ${apply}
      return MOODLE::RESTORE_RECORD_ID(${literal(returns)})
    `)

  const [m_moodlenetContributorRecord] = await cursor.all()
  return m_moodlenetContributorRecord ?? null
}


function getContributorByIdSelectAql(select: moodlenetContributorIdSelect, dbStruct: dbStruct) {
  return select.by === 'moodlenetContributorId'
    ? aql`LET moodlenetContributorDoc = DOCUMENT(${dbStruct.appData.coll.contributor}, ${select.moodlenetContributorId})
            FILTER moodlenetContributorDoc !== null`
    : select.by === 'userAccountId' || select.by === 'userProfileId'
      ? aql`
        LET userProfileDoc = (${getUserProfileByIdSelectAql(select, dbStruct)})
        FILTER userProfileDoc !== null
        FOR moodlenetContributorDoc IN ${dbStruct.appData.coll.contributor}
          FILTER moodlenetContributorDoc.userProfile.id == userProfileDoc._key
          LIMIT 1
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
