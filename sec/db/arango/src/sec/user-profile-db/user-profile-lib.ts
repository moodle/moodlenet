import { deep_partial_props } from '@moodle/lib-types'
import { userAccountId } from '@moodle/module/user-account'
import { aql } from 'arangojs'
import { AqlQuery } from 'arangojs/aql'
import { dbStruct } from '../../db-structure'
import { userProfileDocument } from './user-profile-types'

export async function getUserProfileByUserAccountId({
  dbStruct,
  userAccountId,
  apply = aql``,
}: {
  dbStruct: dbStruct
  userAccountId: userAccountId
  apply?: AqlQuery
}) {
  const cursor = await dbStruct.data.db.query(aql<userProfileDocument>`
    FOR userProfile in ${dbStruct.data.coll.userProfile}
    FILTER userProfile.user.id == ${userAccountId}
    LIMIT 1
    ${apply}
    RETURN userProfile
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
  partialUserProfile: deep_partial_props<userProfileDocument>
}) {
  return getUserProfileByUserAccountId({
    apply: aql`UPDATE userProfile WITH ${partialUserProfile} IN ${dbStruct.data.coll.userProfile}`,
    dbStruct,
    userAccountId,
  })
}
