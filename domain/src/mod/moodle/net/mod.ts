import { mod } from '../../../types'
import { WebsiteInfo, WebsiteLayouts } from './types/website'

export type module = mod<{
  V0_1: {
    pri: {
      website: {
        info(): Promise<WebsiteInfo>
        layouts(): Promise<WebsiteLayouts>
      }
    }
    sec: {
      website: {
        info(): Promise<WebsiteInfo>
        layouts(): Promise<WebsiteLayouts>
      }
    }
    // prm: {}
  }
}>
