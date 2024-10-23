import { UserProfilePrimaryMsgSchemaConfigs } from '@moodle/module/user-profile'
import type { makeAllPrimarySchemas } from '../lib'
import { userAccountPrimaryMsgSchemaConfigs } from '../modules/user-account'
import { MoodleNetPrimaryMsgSchemaConfigs } from '../modules/net'
import { OrgPrimaryMsgSchemaConfigs } from '../modules/org'
import { uploadMaxSizeConfigs } from '../modules/storage'

export type AllSchemaConfigs = {
  userAccountSchemaConfigs: userAccountPrimaryMsgSchemaConfigs
  moodleNetSchemaConfigs: MoodleNetPrimaryMsgSchemaConfigs
  orgSchemaConfigs: OrgPrimaryMsgSchemaConfigs
  uploadMaxSizeConfigs: uploadMaxSizeConfigs
  userProfileSchemaConfigs: UserProfilePrimaryMsgSchemaConfigs
}

export type AllPrimarySchemas = ReturnType<typeof makeAllPrimarySchemas>
