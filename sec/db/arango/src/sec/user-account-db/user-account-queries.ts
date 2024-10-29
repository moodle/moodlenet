import { _void, email_address, ok_ko } from '@moodle/lib-types'
import { Document } from 'arangojs/documents'
import { userAccountId, userAccountRecord } from 'domain/src/modules/user-account'
import { dbStruct } from '../../db-structure'
import { restore_maybe_record, RESTORE_RECORD_AQL } from '../../lib/key-id-mapping'

export async function getUserByEmail({
  email,
  dbStruct,
}: {
  dbStruct: dbStruct
  email: email_address
}): Promise<ok_ko<userAccountRecord>> {
  const cursor = await dbStruct.userAccount.db.query<userAccountRecord>(
    `FOR userAccountDoc IN ${dbStruct.userAccount.coll.userAccount.name}
      FILTER userAccountDoc.contacts.email == @email
      LIMIT 1
      RETURN ${RESTORE_RECORD_AQL('userAccountDoc')}`,
    { email },
  )
  const foundUser = await cursor.next()
  return foundUser ? [true, foundUser] : [false, _void]
}
export async function getUserById({
  userAccountId,
  dbStruct,
}: {
  dbStruct: dbStruct
  userAccountId: userAccountId
}): Promise<ok_ko<userAccountRecord>> {
  const foundUser = await dbStruct.userAccount.coll.userAccount
    .document({ _key: userAccountId }, { graceful: true })
    .then(restore_maybe_record)
  return foundUser ? [true, foundUser] : [false, _void]
}
