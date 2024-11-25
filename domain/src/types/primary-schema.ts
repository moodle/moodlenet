import type { makeAllPrimarySchemas } from '../lib'
import { eduPrimaryEnabledCategoriesSchemaConfigs, eduPrimaryMsgSchemaConfigs } from '../modules/edu'
import { moodlenetEduPublishPrimaryMsgSchemaConfigOverrides, moodlenetPrimaryMsgSchemaConfigs } from '../modules/moodlenet'
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
  eduSchemaConfigs: eduPrimaryMsgSchemaConfigs
  eduPublishSchemaConfigs: eduPrimaryMsgSchemaConfigs
  enabledCategoriesSchemaConfigs: eduPrimaryEnabledCategoriesSchemaConfigs
  eduPublishPrimaryMsgSchemaConfigOverrides: moodlenetEduPublishPrimaryMsgSchemaConfigOverrides
}

export type AllPrimarySchemas = ReturnType<typeof makeAllPrimarySchemas>
