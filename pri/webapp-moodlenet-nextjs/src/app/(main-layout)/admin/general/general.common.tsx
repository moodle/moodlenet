import { net, org } from '@moodle/domain'

export interface MakeAdminGeneralSchemaDeps {
  moodleNetSchemaConfigs: net.MoodleNetPrimaryMsgSchemaConfigs
  orgSchemaConfigs: org.OrgPrimaryMsgSchemaConfigs
}

export function provideAdminGeneralSchemas({
  moodleNetSchemaConfigs,
  orgSchemaConfigs,
}: MakeAdminGeneralSchemaDeps) {
  const { updateMoodleNetInfoSchema: moodleNetInfoSchema } =
    net.getMoodleNetPrimarySchemas(moodleNetSchemaConfigs)
  const { updateOrgInfoSchema: orgInfoSchema } = org.getOrgPrimarySchemas(orgSchemaConfigs)
  return {
    generalSchema: orgInfoSchema.merge(moodleNetInfoSchema),
    moodleNetInfoSchema,
    orgInfoSchema,
  }
}
