import { time_duration_string_schema } from '@moodle/lib-types'
import { userAccountConfigs, userAccountSchemas } from '../types'

export const DEFAULT_USER_ACCOUNT_SCHEMAS: userAccountSchemas = {
  eduDraftsOverrides: {
    collection: {},
    resource: {},
  },
}
export const DEFAULT_USER_ACCOUNT_CONFIGS: userAccountConfigs = {
  emailConfirmationTokenExpires: time_duration_string_schema.parse('P1D'),
}
