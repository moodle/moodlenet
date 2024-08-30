import { mod, reply } from '../../../types'
import { WebsiteInfo } from './types/website/info'
import { Layouts } from './types/website/layouts'

export type module = mod<{
  V0_1: {
    pri: {
      read: {
        'website-info'(): reply<{ _200: { info: WebsiteInfo }; _201: { x: number } }>
        'layouts'(): reply<{ _200: { layouts: Layouts } }>
      }
    }
    prm: {
      net: string
    }
  }
}>
