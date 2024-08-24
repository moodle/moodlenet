import { loginFormConfigs } from '@/app/(simple-layout)/login/@moodleEmailPwdAuthentication/moodle-email-pwd-authentication.common'
import { signupFormConfigs } from '@/app/(simple-layout)/signup/@moodleEmailPwdAuthentication/moodle-email-pwd-authentication.common'

export interface Modules {
  'moodle-email-pwd-authentication': {
    configs: {
      loginForm: loginFormConfigs
      signupForm: signupFormConfigs
    }
  }
}

export interface DeploymentInfo {
  domain: string
  secure: boolean
  basePath: string
}

export interface WebsiteInfo {
  title: string
  subtitle: string
  logo: string
  smallLogo: string
}
