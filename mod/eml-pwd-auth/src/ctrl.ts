import { mod_ctrl, replyOk } from '@moodle/core/domain'

export const ctrl: mod_ctrl<'moodle-eml-pwd-auth'> = {
  'moodle-eml-pwd-auth': {
    read: {
      async configs() {
        return replyOk({
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
  },
}
