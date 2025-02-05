import * as moo from 'moodle-domain'

export const defaultpermissionsConfig: moo.Permissions<true> = {
  admin: {
    directives: null,
    scope: {},
  },
  anonymous: {
    directives: null,
    scope: {
      signupToTheSystem: {
        directives: null,
        useCase: {
          fooSignup: {
            directives: { a: '' },
          },
          signupWithMyEmail: {
            directives: null,
          },
        },
      },
    },
  },
  any: {
    directives: {
      general: {
        user: {
          displayName: { max: 100, min: 2, regex: null },
          email: { max: 100 },
          password: { max: 100, min: 8, regex: null },
        },
      },
    },
    scope: {
      systemAccess: {
        directives: null,
        useCase: {
          permissions: {
            directives: null,
          },
        },
      },
    },
  },
  authenticated: {
    directives: null,
    scope: {},
  },
  fooPersona: {
    directives: null,
    scope: {
      fooscope: {
        directives: null,
        useCase: {
          some: {
            directives: null,
          },
        },
      },
    },
  },
}
