import { url_string_schema } from '@moodle/lib-types'
import { Configs } from '../types'

export const org_default_configs: Configs = {
  info: {
    name: 'MoodleNet',
    logo: url_string_schema.parse('https://moodle.net/08469f8073a8f969253823d5d6ed6ffa.png'),
    smallLogo: url_string_schema.parse('https://moodle.net/e80d311942d3ce22651b33968a87ecb1.png'),
    copyright: '',
    physicalAddress: '',
    websiteUrl: url_string_schema.parse('https://moodle.org'),
  },
  orgPrimaryMsgSchemaConfigs: {
    info: {
      name: { min: 1, max: 50 },
      smallLogo: { min: 0, max: 256 },
      logo: { min: 0, max: 256 },
      websiteUrl: { min: 0, max: 256 },
      physicalAddress: { min: 0, max: 200 },
      copyright: { min: 0, max: 100 },
    },
  },
}
