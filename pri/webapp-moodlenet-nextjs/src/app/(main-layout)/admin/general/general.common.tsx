import { getMoodleNetPrimarySchemas } from '@moodle/mod-net/v1_0/lib'
import { MoodleNetPrimaryMsgSchemaConfigs } from '@moodle/mod-net/v1_0/types'
import { getOrgPrimarySchemas } from '@moodle/mod-org/v1_0/lib'
import { OrgPrimaryMsgSchemaConfigs } from '@moodle/mod-org/v1_0/types'

export interface MakeAdminGeneralSchemaDeps {
  moodleNetSchemaConfigs: MoodleNetPrimaryMsgSchemaConfigs
  orgSchemaConfigs: OrgPrimaryMsgSchemaConfigs
}

export function provideAdminGeneralSchemas({
  moodleNetSchemaConfigs,
  orgSchemaConfigs,
}: MakeAdminGeneralSchemaDeps) {
  const { moodleNetInfoSchema } = getMoodleNetPrimarySchemas(moodleNetSchemaConfigs)
  const { orgInfoSchema } = getOrgPrimarySchemas(orgSchemaConfigs)
  return {
    generalSchema: orgInfoSchema.merge(moodleNetInfoSchema),
    moodleNetInfoSchema,
    orgInfoSchema,
  }
}
