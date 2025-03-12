import { i_pos_schema, time_duration_string_schema } from '@moodle/lib-types'
import { userAccountConfigs, userAccountSchemas } from '../types'

export const DEFAULT_USER_ACCOUNT_SCHEMAS: userAccountSchemas = {
  eduDraftsOverrides: {
    collection: {},
    resource: {},
  },
  uploadSize: {
    file: { max: i_pos_schema.parse(0xafffff /* 11_534_335 */) },
    image: { max: i_pos_schema.parse(0x5ffffff /* 100_663_295 */) },
  },
}
export const DEFAULT_USER_ACCOUNT_CONFIGS: userAccountConfigs = {
  emailConfirmationTokenExpires: time_duration_string_schema.parse('P1D'),
}
