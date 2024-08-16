import { loginFormConfigs } from '@/app/(simple-layout)/login/@moodle-simple-email-access-login/moodle-simple-email-access-login.common'
import { signupFormConfigs } from '@/app/(simple-layout)/signup/@moodle-simple-email-access-signup/moodle-simple-email-access-signup.common'
import { Layouts } from './website/layouts'

export interface Website {
  info: WebsiteInfo
  layouts: Layouts
  modules: Modules
}

export interface Modules {
  'moodle-simple-email-access': {
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
