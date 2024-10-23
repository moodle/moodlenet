import { _void, email_address, ok_ko } from '@moodle/lib-types'
import { Document } from 'arangojs/documents'
import { userAccountId, userAccountRecord } from 'domain/src/modules/user-account'
import { dbStruct } from '../../db-structure'
import { userAccountDocument2userAccountRecord } from './user-account-mappings'
import { userAccountDocument } from './user-account-types'

export async function getUserByEmail({
  email,
  dbStruct,
}: {
  dbStruct: dbStruct
  email: email_address
}): Promise<ok_ko<userAccountRecord>> {
  const cursor = await dbStruct.userAccount.db.query<Document<userAccountDocument>>(
    `FOR user IN ${dbStruct.userAccount.coll.user.name} FILTER user.contacts.email == @email LIMIT 1 RETURN user`,
    { email },
  )
  const foundUser = await cursor.next()
  return foundUser ? [true, userAccountDocument2userAccountRecord(foundUser)] : [false, _void]
}
export async function getUserById({
  userAccountId,
  dbStruct,
}: {
  dbStruct: dbStruct
  userAccountId: userAccountId
}): Promise<ok_ko<userAccountRecord>> {
  const foundUser = await dbStruct.userAccount.coll.user.document({ _key: userAccountId }, { graceful: true })
  return foundUser ? [true, userAccountDocument2userAccountRecord(foundUser)] : [false, _void]
}
