import { loginFormConfigs } from '@/app/(simple-layout)/login/@moodle-simple-email-access-login/moodle-simple-email-access-login.common'
import { signupFormConfigs } from '@/app/(simple-layout)/signup/@moodle-simple-email-access-signup/moodle-simple-email-access-signup.common'
import { Layouts } from './website/layouts'

export interface Website {
  info: WebsiteInfo
  layouts: Layouts
  modules: Modules
}

export interface Modules {
  moodleSimpleEmailAccess: {
    configs: {
      loginForm: loginFormConfigs
      signupForm: signupFormConfigs
    }
  }
}

export interface WebsiteInfo {
  domain: string
  secure: boolean
  basePath: string
  title: string
  subtitle: string
  logo: string
  smallLogo: string
}
