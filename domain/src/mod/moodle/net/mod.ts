import { mod } from '../../../types'
import { WebsiteInfo, WebsiteLayouts } from './types/website'

export type module = mod<{
  V0_1: {
    pri: {
      read: {
        websiteInfo(): Promise<WebsiteInfo>
        websiteLayouts(): Promise<WebsiteLayouts>
      }
    }
    // prm: {}
  }
}>
