import { deep_partial_props } from '@moodle/lib-types'
import { userProfileIdSelect, userProfileRecord } from '@moodle/module/user-profile'
import { aql } from 'arangojs'
import { AqlQuery } from 'arangojs/aql'
import { dbStruct } from '../../db-structure'

export async function getUserProfileById({
  dbStruct,
  select,
  apply = aql``,
}: {
  dbStruct: dbStruct
  select: userProfileIdSelect
  apply?: AqlQuery
}) {
  const filter_id =
    select.by === 'userProfileId'
      ? aql`userProfileDoc._key == ${select.userProfileId}`
      : aql`userProfileDoc.userAccount.id == ${select.userAccountId}`

  const cursor = await dbStruct.moodlenet.db.query(aql<userProfileRecord>`
    FOR userProfileDoc in ${dbStruct.userAccount.coll.userProfile}
    FILTER ${filter_id}
    LIMIT 1
    ${apply}
    RETURN MOODLE::RESTORE_RECORD(userProfileDoc)
    `)
  const [userProfile] = await cursor.all()
  return userProfile ?? null
}

export async function updateUserProfileById({
  dbStruct,
  select,
  partialUserProfile,
  preCondition = aql``,
}: {
  select: userProfileIdSelect
  dbStruct: dbStruct
  partialUserProfile: deep_partial_props<userProfileRecord>
  preCondition?: AqlQuery
}) {
  return getUserProfileById({
    apply: aql`
    ${preCondition}
    UPDATE userProfileDoc WITH ${partialUserProfile} IN ${dbStruct.userAccount.coll.userProfile}`,
    dbStruct,
    select,
  })
}
