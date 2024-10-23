import { deep_partial } from '@moodle/lib-types'
import { aql } from 'arangojs'
import { AqlQuery } from 'arangojs/aql'
import { db_struct } from '../../db-structure'
import { userProfileDocument } from './types'
import { userId } from '@moodle/module/user-account'

export async function getUserProfileByUserId<T = userProfileDocument>({
  db_struct,
  userId,
  apply = aql``,
}: {
  db_struct: db_struct
  userId: userId
  apply?: AqlQuery
}) {
  const cursor = await db_struct.data.db.query<T>(aql`
    FOR userProfile in ${db_struct.data.coll.userProfile}
    FILTER userProfile.user.id == ${userId}
    LIMIT 1
    ${apply}
    RETURN userProfile
    `)
  const [userProfile] = await cursor.all()
  return userProfile ?? null
}

export async function updateUserProfileByUserId({
  db_struct,
  userId,
  partialUserProfile,
}: {
  userId: userId
  db_struct: db_struct
  partialUserProfile: deep_partial<userProfileDocument>
}) {
  return getUserProfileByUserId({
    apply: aql`UPDATE userProfile WITH ${partialUserProfile} IN ${db_struct.data.coll.userProfile}`,
    db_struct,
    userId,
  })
}
