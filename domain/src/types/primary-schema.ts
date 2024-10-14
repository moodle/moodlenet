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
}

export type AllPrimarySchemas = ReturnType<typeof makeAllPrimarySchemas>
