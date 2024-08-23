import { SessionContext } from '#lib/server/session/types/context'
import { Modules } from '#lib/server/session/types/website'

export const modules: SessionContext['website']['modules'] = async function modules(k) {
  const mod: Modules = {
    'moodle-email-pwd-authentication': {
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
    },
  }

  return mod[k]
}
