import { generateNanoId } from '@moodle/lib-id-gen'
import { date_time_string, email_address } from '@moodle/lib-types'
import { password_hash } from '../../crypto/types'
import { newUserAccountMoodlenetData } from '../../moodlenet/core/lib/new-user'
import { userAccountRecord, userRole } from '../types'

export interface CreateNewUserAccountRecordDataArg {
  displayName: string
  email: email_address
  passwordHash: password_hash
  creationDate?: date_time_string
  lastLogin?: date_time_string
  roles?: userRole[]
}

export async function createNewUserAccountRecordData({
  displayName,
  email,
  passwordHash,
  roles = [],
  creationDate,
  lastLogin,
}: CreateNewUserAccountRecordDataArg): Promise<userAccountRecord> {
  const now = date_time_string('now')
  const id = await generateNanoId()
  return {
    id,
    creationDate: creationDate ?? now,
    roles: roles,
    roleHistory: [],
    displayName,
    contacts: {
      email,
    },
    passwordHash,
    activityStatus: {
      lastLogin: lastLogin ?? now,
    },
    deactivated: false,
    appData: {
      moodlenet: await newUserAccountMoodlenetData(),
    },
  }
}
