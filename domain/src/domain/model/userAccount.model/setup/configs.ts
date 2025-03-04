import { time_duration_string_schema } from '@moodle/lib-types'
import { userAccountConfigs } from '../types'

export const DEFAULT_USER_ACCOUNT_CONFIGS: userAccountConfigs = {
  schema: {
    eduDraftsOverrides: {
      collection: {},
      resource: {},
    },
  },
  emailConfirmationTokenExpires: time_duration_string_schema.parse('P1D'),
}
