import { ch, event, mod, mod_ctrl, receive, send } from '../mod'

declare module '@moodle/domain' {
  export interface MoodleDomain {
    net: mod_moodlenet
  }
}

export interface Moodlenet {
  info: {
    title: string
    subtitle: string
    logo: string
    smallLogo: string
  }
  deployment: {
    domain: string
    secure: boolean
  }
  webapp: {
    basePath: string
    // session: {
    //   currentUser(): Promise<user>
    //   permission: get<Permissions>
    //   layouts: {
    //     pages: PageLayouts
    //     roots: RootLayouts
    //   }
    // }
  }
}

export type mod_moodlenet = mod<{
  name: 'net'
  receives: {
    chr1: ch<{
      a1r11: receive<{ a1r11: 'a1r11' }, { a1r11_r: 'a1r11_r' }>
      a1r12: receive<{ a1r12: 'a1r12' }, { a1r12_r: 'a1r12_r' }>
      a1r13: receive<{ a1r13: 'a1r13' }> //{ a1s12_r: 'a1s12_r' }>
    }>
    chr2: ch<{
      a1r21: receive<{ a1r21: 'a1r21' }, { a1r21_r: 'a1r21_r' }>
      a1r22: receive<{ a1r22: 'a1r22' }, { a1r22_r: 'a1r22_r' }>
      a1r23: receive<{ a1r23: 'a1r23' }> //{ a1s12_r: 'a1s12_r' }>
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
  config: { a: number }
}>

export const ctrl: mod_ctrl<mod_moodlenet> = {
  chr2: {
    async a1r21(pl) {
      pl.a1r21
      // return {status:'done',reply:{a1r11_r:'a1r11_r'}}
      // return ['done', { a1r21_r: 'a1r21_r', message:'',aerr:'' }]
      return { a1r21_r: 'a1r21_r' }
    },
    async a1r23(pl) {
      pl.a1r23
      // return {status:'done',reply:{a1r11_r:'a1r11_r'}}
    },
    async a1r22(pl) {
      pl.a1r22
      // return {status:'done',reply:{a1r11_r:'a1r11_r'}}
      return { a1r22_r: 'a1r22_r' }
    },
  },
  chr1: {
    async a1r11(pl) {
      pl.a1r11
      // return {status:'done',reply:{a1r11_r:'a1r11_r'}}
      return { a1r11_r: 'a1r11_r' }
      // return {status:'done',reply:{a1r11_r:'a1r11_r'}}
    },
    async a1r13(pl) {
      pl.a1r13
      // pl.a1r12
      // return {status:'done',reply:{a1r11_r:'a1r11_r'}}
    },
    async a1r12(pl) {
      pl.a1r12
      // return {status:'done',reply:{a1r11_r:'a1r11_r'}}
      return { a1r12_r: 'a1r12_r' }
    },
  },
}
