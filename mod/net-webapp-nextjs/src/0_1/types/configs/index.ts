export * from './layouts'
import { Layouts } from './layouts'

export interface Configs {
  layouts: Layouts
  deployment: {
    domain: string
    secure: boolean
    basePath: string
  }
}
