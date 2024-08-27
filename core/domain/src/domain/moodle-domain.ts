import { _t } from '@moodle/lib/types'
import { domain, mod } from '../types'

declare const _: unique symbol
export interface MoodleDomain {
  [_]: mod<any>
}
export type moodle_domain = domain<_t<MoodleDomain>>
export default moodle_domain
