import { i_nat, i_pos } from '@moodle/lib-types'
import { configs } from '../types'

export const DEFAULT_CONFIGS: configs = {
  schema: {
    orgInfo: {
      websiteUrl: { max: i_nat(100) },
      physicalAddress: { min: i_nat(0), max: i_nat(500) },
      copyright: { min: i_nat(0), max: i_nat(300) },
    },
    general: {
      email: { max: i_pos(100) },
      textSearch: { min: i_pos(3), max: i_pos(100) },
      id: { min: i_pos(4), max: i_pos(64) },
    },
    baseUserData: {
      password: { min: i_pos(8), max: i_pos(64) },
      displayName: { min: i_pos(3), max: i_pos(50) },
    },
  },
  info: {
    copyright: '',
    physicalAddress: '',
    websiteUrl: '',
  },
}
