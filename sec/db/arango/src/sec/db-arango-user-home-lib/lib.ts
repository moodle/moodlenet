import { deep_partial } from '@moodle/lib-types'
import { aql } from 'arangojs'
import { AqlQuery } from 'arangojs/aql'
import { iam } from '@moodle/domain'
import { db_struct } from '../../db-structure'
import { userHomeDocument } from './types'

export async function getUserHomeByUserId<T = userHomeDocument>({
  db_struct,
  userId,
  apply = aql``,
}: {
  db_struct: db_struct
  userId: iam.user_id
  apply?: AqlQuery
}) {
  const cursor = await db_struct.data.db.query<T>(aql`
    FOR userHome in ${db_struct.data.coll.userHome}
    FILTER userHome.user.id == ${userId}
    LIMIT 1
    ${apply}
    RETURN userHome
    `)
  const [userHome] = await cursor.all()
  return userHome ?? null
}

export async function updateUserHomeByUserId({
  db_struct,
  userId,
  pUserHome,
}: {
  userId: iam.user_id
  db_struct: db_struct
  pUserHome: deep_partial<userHomeDocument>
}) {
  return getUserHomeByUserId({
    apply: aql`UPDATE userHome WITH ${pUserHome} IN ${db_struct.data.coll.userHome}`,
    db_struct,
    userId,
  })
}
