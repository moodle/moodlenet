import { _void, email_address, ok_ko } from '@moodle/lib-types'
import { userAccountId, userAccountRecord } from '@moodle/module/user-account'
import { aql } from 'arangojs'
import { dbStruct } from '../../db-structure'

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
      RETURN MOODLE::RESTORE_RECORD_ID(userAccountDoc)`,
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
  const cursor = await dbStruct.userAccount.db.query<userAccountRecord>(
    aql`FOR userAccountDoc IN ${dbStruct.userAccount.coll.userAccount}
      FILTER userAccountDoc._key == ${userAccountId}
      LIMIT 1
      RETURN MOODLE::RESTORE_RECORD_ID(userAccountDoc)`,
  )
  const [foundUser] = await cursor.all()

  return foundUser ? [true, foundUser] : [false, _void]
}
