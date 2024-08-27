import { mod_ctrl } from '@moodle/core/domain'
import { statusOk } from 'core/domain/src/domain/access-status'
import moodle_eml_pwd_auth_mod from './mod'

export const ctrl: mod_ctrl<moodle_eml_pwd_auth_mod> = {
  read: {
    async configs() {
      return statusOk({
        configs: {
          loginForm: {
            email: { min: 5, max: 35 },
            password: { min: 8, max: 35 },
          },
          signupForm: {
            email: { min: 5, max: 35 },
            password: { min: 8, max: 35 },
            displayName: { min: 3, max: 35 },
          },
        },
      })
    },
  },
}