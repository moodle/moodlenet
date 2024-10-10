import { AllPrimarySchemas } from '@moodle/domain'

export type MakeAdminGeneralSchemaDeps = Pick<AllPrimarySchemas, 'org' | 'moodleNet'>

export function provideAdminGeneralSchemas({ moodleNet, org }: MakeAdminGeneralSchemaDeps) {
  const moodleNetInfoSchema = moodleNet.updateMoodleNetInfoSchema
  const orgInfoSchema = org.updateOrgInfoSchema
  return {
    generalSchema: orgInfoSchema.merge(moodleNetInfoSchema),
    moodleNetInfoSchema,
    orgInfoSchema,
  }
}
