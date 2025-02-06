import { integer_schema } from '@moodle/lib-types'

export const defaultpermissionsConfig: moo.permissions.configs = {
  admin: {},
  authenticated: {},
  anonymous: {
    access: {
      signup: {
        withMyEmail: {
          confirmMyEmail: {},
          submitSignupForm: {},
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
      permissions: {
        read: {
          getMine: {},
        },
      },
    },
  },
}
