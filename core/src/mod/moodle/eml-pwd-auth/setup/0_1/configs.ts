import { Configs_0_1 } from '../../types/0_1'

export const defaultMoodleEmlPwdAuthConfigs_0_1: Configs_0_1 = {
  loginForm: {
    email: { min: 5, max: 35 },
    password: { min: 8, max: 35 },
  },
  signupForm: {
    email: { min: 5, max: 35 },
    password: { min: 8, max: 35 },
    displayName: { min: 3, max: 35 },
  },
}
