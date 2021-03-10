import { aql } from 'arangojs'
import { Maybe } from '../../../../../../lib/helpers/types'
import { UserAccountDB } from '../env'
import { UserAccountRecord } from '../types'

export const isEmailAvailable = async ({ email, db: { db } }: { db: UserAccountDB; email: string }) => {
  const cursor = await db.query(aql`
    FOR userAccount IN UserAccount
    FILTER userAccount.email == ${email}
            || userAccount.changeEmailRequest.email == ${email}
    LIMIT 1
    RETURN userAccount
  `)
  const mAccount: Maybe<UserAccountRecord> = await cursor.next()
  return !mAccount
}
