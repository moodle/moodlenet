import { loginFormConfigs } from '@/app/(simple-layout)/login/@moodle-email-pwd-authentication/moodle-email-pwd-authentication.common'
import { signupFormConfigs } from '@/app/(simple-layout)/signup/@moodle-email-pwd-authentication/moodle-email-pwd-authentication.common'
import { Layouts } from './website/layouts'

export interface Website {
  info: WebsiteInfo
  layouts: Layouts
  modules: Modules
}

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
