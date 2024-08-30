import { mod } from '../../../types'
import { WebsiteInfo } from './types/website/info'
import { Layouts } from './types/website/layouts'

export type module = mod<{
  V0_1: {
    pri: {
      read: {
        websiteInfo(): Promise<{ info: WebsiteInfo }>
        layouts(): Promise<{ layouts: Layouts }>
      }
    }
    prm: {
      net: string
    }
  }
}>
