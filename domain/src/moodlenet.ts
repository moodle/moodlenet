import { Modules } from './modules'

export interface Moodlenet {
  info: {
    title: string
    subtitle: string
    logo: string
    smallLogo: string
  }
  deployment: {
    domain: string
    secure: boolean
    basePath: string
  }
  modules: Modules
}
