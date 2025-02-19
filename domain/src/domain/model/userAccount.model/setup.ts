import { userAccountConfigs } from './userAccount.model'

export const DEFAULT_USER_ACCOUNT_CONFIGS: userAccountConfigs = {
  dataValidationConfigs: {
    baseUser: {
      displayName: { max: int(100), min: int(100) },
      password: { max: int(100), min: int(100) },
      email: { max: int(100) },
    },
  },
}
