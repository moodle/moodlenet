import type { makeAllPrimarySchemas } from '../lib'
import { moodlenetPrimaryMsgSchemaConfigs } from '../modules/moodlenet'
import { orgPrimaryMsgSchemaConfigs } from '../modules/org'
import { uploadMaxSizeConfigs } from '../modules/storage'
import { userAccountPrimaryMsgSchemaConfigs } from '../modules/user-account'
import { UserProfilePrimaryMsgSchemaConfigs } from '../modules/user-profile'

export type AllSchemaConfigs = {
  userAccountSchemaConfigs: userAccountPrimaryMsgSchemaConfigs
  moodlenetSchemaConfigs: moodlenetPrimaryMsgSchemaConfigs
  orgSchemaConfigs: orgPrimaryMsgSchemaConfigs
  uploadMaxSizeConfigs: uploadMaxSizeConfigs
  userProfileSchemaConfigs: UserProfilePrimaryMsgSchemaConfigs
}

export type AllPrimarySchemas = ReturnType<typeof makeAllPrimarySchemas>
