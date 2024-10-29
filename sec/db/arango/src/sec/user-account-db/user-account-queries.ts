import { _void, email_address, ok_ko } from '@moodle/lib-types'
import { userAccountId, userAccountRecord } from '@moodle/module/user-account'
import { aql } from 'arangojs'
import { dbStruct } from '../../db-structure'
import { restore_maybe_record } from '../../lib/key-id-mapping'

export async function getUserByEmail({
  email,
  dbStruct,
}: {
  dbStruct: dbStruct
  email: email_address
}): Promise<ok_ko<userAccountRecord>> {
  const cursor = await dbStruct.userAccount.db.query<userAccountRecord>(
    aql`FOR userAccountDoc IN ${dbStruct.userAccount.coll.userAccount}
      FILTER userAccountDoc.contacts.email == ${email}
      LIMIT 1
      RETURN MOODLE::RESTORE_RECORD(userAccountDoc)`,
  )
  const [foundUser] = await cursor.all()

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
