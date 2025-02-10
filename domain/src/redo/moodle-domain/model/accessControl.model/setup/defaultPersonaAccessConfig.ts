import { integer_schema } from '@moodle/lib-types'

export const defaultSessionConfig: moo.session.configs = {
  // admin: {},
  authenticated: {},
  anonymous: {
    access: {
      signup: {
        withMyEmail: {
          confirmMyEmail: {},
          submitSignupForm: {},
        },
      },
      login: {
        withMyEmail: {
          emailLogin: {},
        },
      },
    },
  },
  any: {
    _: {
      general: {
        userDataConfigs: {
          displayName: { max: integer_schema.parse(100), min: integer_schema.parse(2) },
          email: { max: integer_schema.parse(100) },
          password: { max: integer_schema.parse(100), min: integer_schema.parse(8) },
        },
      },
    },
    system: {
      session: {
        get: {
          myOwn: {},
        },
      },
    },
  },
}
