import { ch, event, mod, receive, send } from '@moodle/domain'
import { WebsiteInfo } from './types/website/info'
import { Layouts } from './types/website/layouts'

declare module '@moodle/domain' {
  export interface MoodleDomain {
    net: moodle_net_mod
  }
}

export default moodle_net_mod
type moodle_net_mod = mod<{
  name: 'net'
  version: '0.1'
  receives: {
    read: ch<{
      'website-info': receive<void, { info: WebsiteInfo }>
      'layouts': receive<void, { layouts: Layouts }>
    }>
  }
  emits: {
    che1: ch<{
      a1e11: event<{ a1e11: 'a1e11' }> //{ a1s12_r: 'a1s12_r' }>
      a1e12: event<{ a1e12: 'a1e12' }> //{ a1s12_r: 'a1s12_r' }>
    }>
    che2: ch<{
      a1e21: event<{ a1e21: 'a1e21' }> //{ a1s12_r: 'a1s12_r' }>
      a1e22: event<{ a1e22: 'a1e22' }> //{ a1s12_r: 'a1s12_r' }>
    }>
  }
  sends: {
    chs1: ch<{
      a1s11: send<{ a1s11: 'a1s11' }, { a1s11_r: 'a1s11_r' }>
      a1s12: send<{ a1s12: 'a1s12' }, { a1s12_r: 'a1s12_r' }>
      a1s13: send<{ a1s13: 'a1s13' }> //{ a1s12_r: 'a1s12_r' }>
    }>
    chs2: ch<{
      a1s21: send<{ a1s21: 'a1s21' }, { a1s21_r: 'a1s21_r' }>
      a1s22: send<{ a1s22: 'a1s22' }, { a1s22_r: 'a1s22_r' }> //{ a1s11_r: 'a1s11_r' }>
      a1s23: send<{ a1s23: 'a1s23' }> //{ a1s12_r: 'a1s12_r' }>
    }>
  }
}>
