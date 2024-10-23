import { deep_partial_props } from '@moodle/lib-types'
import { userAccountId } from '@moodle/module/user-account'
import { aql } from 'arangojs'
import { AqlQuery } from 'arangojs/aql'
import { db_struct } from '../../db-structure'
import { userProfileDocument } from './types'

export async function getUserProfileByUserAccountId<T = userProfileDocument>({
  db_struct,
  userAccountId,
  apply = aql``,
}: {
  db_struct: db_struct
  userAccountId: userAccountId
  apply?: AqlQuery
}) {
  const cursor = await db_struct.data.db.query<T>(aql`
    FOR userProfile in ${db_struct.data.coll.userProfile}
    FILTER userProfile.user.id == ${userAccountId}
    LIMIT 1
    ${apply}
    RETURN userProfile
    `)
  const [userProfile] = await cursor.all()
  return userProfile ?? null
}

export async function updateUserProfileByUserAccountId({
  db_struct,
  userAccountId,
  partialUserProfile,
}: {
  userAccountId: userAccountId
  db_struct: db_struct
  partialUserProfile: deep_partial_props<userProfileDocument>
}) {
  return getUserProfileByUserAccountId({
    apply: aql`UPDATE userProfile WITH ${partialUserProfile} IN ${db_struct.data.coll.userProfile}`,
    db_struct,
    userAccountId,
  })
}
