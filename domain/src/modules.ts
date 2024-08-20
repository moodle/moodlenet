export interface Modules {
  'moodle-email-pwd-authentication': {
    configs: {
      loginForm: {
        email: {
          max: number
          min: number
        }
        password: {
          max: number
          min: number
        }
      }
      signupForm: {
        email: {
          max: number
          min: number
        }
        password: {
          max: number
          min: number
        }
        displayName: {
          max: number
          min: number
        }
      }
    }
  }
}
