import { getMoodleNetPrimarySchemas } from '@moodle/mod-net/lib'
import { MoodleNetPrimaryMsgSchemaConfigs } from '@moodle/mod-net/types'
import { getOrgPrimarySchemas } from '@moodle/mod-org/lib'
import { OrgPrimaryMsgSchemaConfigs } from '@moodle/mod-org/types'

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
