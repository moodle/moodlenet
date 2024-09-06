import { Configs } from '../'

export const defaultIamConfigs: Configs = {
  validations: {
    user: {
      email: { min: 5, max: 35 },
      password: { min: 8, max: 35 },
      displayName: { min: 3, max: 35 },
    },
  },
}
