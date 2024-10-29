import { deep_partial_props } from '@moodle/lib-types'
import { userAccountId } from '@moodle/module/user-account'
import { aql } from 'arangojs'
import { AqlQuery } from 'arangojs/aql'
import { dbStruct } from '../../db-structure'
import { userProfileRecord } from '@moodle/module/user-profile'
import { RESTORE_RECORD_AQL } from '../../lib/key-id-mapping'

export async function getUserProfileByUserAccountId({
  dbStruct,
  userAccountId,
  apply = aql``,
}: {
  dbStruct: dbStruct
  userAccountId: userAccountId
  apply?: AqlQuery
}) {
  const cursor = await dbStruct.moodlenet.db.query(aql<userProfileRecord>`
    FOR userProfile in ${dbStruct.userAccount.coll.userProfile}
    FILTER userProfile.userAccount.id == ${userAccountId}
    LIMIT 1
    ${apply}
    RETURN ${RESTORE_RECORD_AQL('userProfile')}
    `)
  const [userProfile] = await cursor.all()
  return userProfile ?? null
}

export async function updateUserProfileByUserAccountId({
  dbStruct,
  userAccountId,
  partialUserProfile,
}: {
  userAccountId: userAccountId
  dbStruct: dbStruct
  partialUserProfile: deep_partial_props<userProfileRecord>
}) {
  return getUserProfileByUserAccountId({
    apply: aql`UPDATE userProfile WITH ${partialUserProfile} IN ${dbStruct.userAccount.coll.userProfile}`,
    dbStruct,
    userAccountId,
  })
}
