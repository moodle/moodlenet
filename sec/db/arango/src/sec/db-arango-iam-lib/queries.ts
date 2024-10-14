import { _void, email_address, ok_ko } from '@moodle/lib-types'
import { Document } from 'arangojs/documents'
import { user_id, user_record } from 'domain/src/modules/iam'
import { db_struct } from '../../db-structure'
import { userDocument2user_record } from './mappings'
import { userDocument } from './types'

export async function getUserByEmail({
  email,
  db_struct,
}: {
  db_struct: db_struct
  email: email_address
}): Promise<ok_ko<user_record>> {
  const cursor = await db_struct.iam.db.query<Document<userDocument>>(
    `FOR user IN ${db_struct.iam.coll.user.name} FILTER user.contacts.email == @email LIMIT 1 RETURN user`,
    { email },
  )
  const foundUser = await cursor.next()
  return foundUser ? [true, userDocument2user_record(foundUser)] : [false, _void]
}
export async function getUserById({
  userId,
  db_struct,
}: {
  db_struct: db_struct
  userId: user_id
}): Promise<ok_ko<user_record>> {
  const foundUser = await db_struct.iam.coll.user.document({ _key: userId }, { graceful: true })
  return foundUser ? [true, userDocument2user_record(foundUser)] : [false, _void]
}
