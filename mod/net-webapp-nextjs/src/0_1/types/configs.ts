import { Layouts } from './layouts-configs'

export interface Configs {
  layouts: Layouts
  deployment: {
    domain: string
    secure: boolean
    basePath: string
  }
}
