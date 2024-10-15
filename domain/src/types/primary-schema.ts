import { UserHomePrimaryMsgSchemaConfigs } from 'domain/src/modules/user-home'
import type { makeAllPrimarySchemas } from '../lib'
import { IamPrimaryMsgSchemaConfigs } from '../modules/iam'
import { MoodleNetPrimaryMsgSchemaConfigs } from '../modules/net'
import { OrgPrimaryMsgSchemaConfigs } from '../modules/org'
import { uploadMaxSizeConfigs } from '../modules/storage'

export type AllSchemaConfigs = {
  iamSchemaConfigs: IamPrimaryMsgSchemaConfigs
  moodleNetSchemaConfigs: MoodleNetPrimaryMsgSchemaConfigs
  orgSchemaConfigs: OrgPrimaryMsgSchemaConfigs
  uploadMaxSizeConfigs: uploadMaxSizeConfigs
  userHomeSchemaConfigs: UserHomePrimaryMsgSchemaConfigs
}

export type AllPrimarySchemas = ReturnType<typeof makeAllPrimarySchemas>
