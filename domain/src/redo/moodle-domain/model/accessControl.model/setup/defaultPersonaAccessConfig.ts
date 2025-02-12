import { integer_schema } from '@moodle/lib-types'

export const defaultSessionConfig: moo.session.configs = {
  admin: {
    _: { validation: { personaType: { max: integer_schema.parse(20), min: integer_schema.parse(3) } } },
    userBase: {
      managePermissions: { personaTypes: { searchUsersByText: {} } },
    },
  },
  authenticated: {
    myAccount: {
      manage: {
        deleteIt: {
          confirmDelete: {},
          request: {},
        },
      },
      security: {
        authentication: {
          changeMyPassword: {},
        },
      },
    },
  },
  any: {
    _: {
      validation: {
        baseUserData: {
          displayName: { max: integer_schema.parse(100), min: integer_schema.parse(2) },
          password: { max: integer_schema.parse(100), min: integer_schema.parse(8) },
        },
        general: {
          email: { max: integer_schema.parse(100) },
          id: { max: integer_schema.parse(100), min: integer_schema.parse(5) },
          textSearch: { max: integer_schema.parse(100), min: integer_schema.parse(2) },
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
          login: {},
        },
        resetMyPassword: {
          requestLink: {},
          setNew: {},
        },
      },
    },
  },
}
