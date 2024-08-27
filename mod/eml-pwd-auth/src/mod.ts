import { ch, mod, receive } from '@moodle/core/domain'
import { Configs } from './types'

declare module '@moodle/core/domain' {
  export interface MoodleDomain {
    'moodle-eml-pwd-auth': moodle_eml_pwd_auth_mod
  }
}

export default moodle_eml_pwd_auth_mod
type moodle_eml_pwd_auth_mod = mod<{
  // name: 'moodle-eml-pwd-auth'
  version: '0.1'
  receives: {
    read: ch<{
      configs: receive<void, { configs: Configs }>
    }>
  }
  emits: {
    // che1: ch<{
    //   a1e11: event<{ a1e11: 'a1e11' }> //{ a1s12_r: 'a1s12_r' }>
    //   a1e12: event<{ a1e12: 'a1e12' }> //{ a1s12_r: 'a1s12_r' }>
    // }>
    // che2: ch<{
    //   a1e21: event<{ a1e21: 'a1e21' }> //{ a1s12_r: 'a1s12_r' }>
    //   a1e22: event<{ a1e22: 'a1e22' }> //{ a1s12_r: 'a1s12_r' }>
    // }>
  }
  sends: {
    // chs1: ch<{
    //   a1s11: send<{ a1s11: 'a1s11' }, { a1s11_r: 'a1s11_r' }>
    //   a1s12: send<{ a1s12: 'a1s12' }, { a1s12_r: 'a1s12_r' }>
    //   a1s13: send<{ a1s13: 'a1s13' }> //{ a1s12_r: 'a1s12_r' }>
    // }>
    // chs2: ch<{
    //   a1s21: send<{ a1s21: 'a1s21' }, { a1s21_r: 'a1s21_r' }>
    //   a1s22: send<{ a1s22: 'a1s22' }, { a1s22_r: 'a1s22_r' }> //{ a1s11_r: 'a1s11_r' }>
    //   a1s23: send<{ a1s23: 'a1s23' }> //{ a1s12_r: 'a1s12_r' }>
    // }>
  }
}>
