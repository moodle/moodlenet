import { AllPrimarySchemas } from '@moodle/domain'

export type MakeAdminGeneralSchemaDeps = Pick<AllPrimarySchemas, 'org' | 'moodlenet'>

export function provideAdminGeneralSchemas({ moodlenet, org }: MakeAdminGeneralSchemaDeps) {
  const moodlenetInfoSchema = moodlenet.updateMoodlenetInfoSchema
  const orgInfoSchema = org.updateOrgInfoSchema
  return {
    generalSchema: orgInfoSchema.merge(moodlenetInfoSchema),
    moodlenetInfoSchema,
    orgInfoSchema,
  }
}
