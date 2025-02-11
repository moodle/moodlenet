import { integer_schema } from '@moodle/lib-types'
import { userAccountConfigs } from './userAccount.model'

export const DEFAULT_USER_ACCOUNT_CONFIGS: userAccountConfigs = {
  dataValidationConfigs: {
    baseUser: {
      displayName: { max: integer_schema.parse(100), min: integer_schema.parse(100) },
      password: { max: integer_schema.parse(100), min: integer_schema.parse(100) },
      email: { max: integer_schema.parse(100) },
    },
  },
}
