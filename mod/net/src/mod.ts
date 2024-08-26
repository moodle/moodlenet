import { ch, empty_payload, mod, receive } from '@moodle/core/domain'

declare module '@moodle/core/domain' {
  export interface MoodleDomain {
    net: moodlenet_mod
  }
}

export default moodlenet_mod
type moodlenet_mod = mod<{
  name: 'net'
  version: '0.1'
  receives: {
    website: ch<{
      'info': receive<empty_payload, WebsiteInfo>
      'deployment': receive<empty_payload, DeploymentInfo>
      'layouts': receive<empty_payload, { page: PageLayouts; root: RootLayouts }>
      'mod-configs': receive<empty_payload, ModuleConfigs>
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
