import { i_pos_schema } from '@moodle/lib-types'
import { userHomeSchemas } from '../types'

export const DEFAULT_USER_ACCOUNT_SCHEMAS: userHomeSchemas = {
  eduDraftsOverrides: {
    collection: {},
    resource: {},
  },
  uploadSize: {
    file: { max: i_pos_schema.parse(0xafffff /* 11_534_335 */) },
    image: { max: i_pos_schema.parse(0x5ffffff /* 100_663_295 */) },
  },
}
