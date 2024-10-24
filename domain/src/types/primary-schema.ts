import { UserProfilePrimaryMsgSchemaConfigs } from '@moodle/module/user-profile'
import type { makeAllPrimarySchemas } from '../lib'
import { userAccountPrimaryMsgSchemaConfigs } from '../modules/user-account'
import { MoodlenetPrimaryMsgSchemaConfigs } from '../modules/moodlenet'
import { OrgPrimaryMsgSchemaConfigs } from '../modules/org'
import { uploadMaxSizeConfigs } from '../modules/storage'

export type AllSchemaConfigs = {
  userAccountSchemaConfigs: userAccountPrimaryMsgSchemaConfigs
  moodlenetSchemaConfigs: MoodlenetPrimaryMsgSchemaConfigs
  orgSchemaConfigs: OrgPrimaryMsgSchemaConfigs
  uploadMaxSizeConfigs: uploadMaxSizeConfigs
  userProfileSchemaConfigs: UserProfilePrimaryMsgSchemaConfigs
}

export type AllPrimarySchemas = ReturnType<typeof makeAllPrimarySchemas>
