import { ch, event, mod, mod_ctrl, receive, send } from '../mod'

export interface Moodlenet2 {
  info: {
    title: string
    subtitle: string
    logo: string
    smallLogo: string
  }
  deployment: {
    domain: string
    secure: boolean
    basePath: string
  }
}

export type def = mod<{
  receives: {
    chr1: ch<{
      a2r11: receive<{ a2r11: 'a2r11' }, { a2r11_r: 'a2r11_r' }>
      a2r12: receive<{ a2r12: 'a2r12' }, { a2r12_r: 'a2r12_r' }>
      a2r13: receive<{ a2r13: 'a2r13' }> //{ a2s12_r: 'a2s12_r' }>
    }>
    chr2: ch<{
      a2r21: receive<{ a2r21: 'a2r21' }, { a2r21_r: 'a2r21_r' }>
      a2r22: receive<{ a2r22: 'a2r22' }, { a2r22_r: 'a2r22_r' }>
      a2r23: receive<{ a2r23: 'a2r23' }> //{ a2s12_r: 'a2s12_r' }>
    }>
  }
  emits: {
    che1: ch<{
      a2e11: event<{ a2e11: 'a2e11' }> //{ a2s12_r: 'a2s12_r' }>
      a2e12: event<{ a2e12: 'a2e12' }> //{ a2s12_r: 'a2s12_r' }>
    }>
    che2: ch<{
      a2e21: event<{ a2e21: 'a2e21' }> //{ a2s12_r: 'a2s12_r' }>
      a2e22: event<{ a2e22: 'a2e22' }> //{ a2s12_r: 'a2s12_r' }>
    }>
  }
  sends: {
    chs1: ch<{
      a2s11: send<{ a2s11: 'a2s11' }, { a2s11_r: 'a2s11_r' }>
      a2s12: send<{ a2s12: 'a2s12' }, { a2s12_r: 'a2s12_r' }>
      a2s13: send<{ a2s13: 'a2s13' }> //{ a2s12_r: 'a2s12_r' }>
    }>
    chs2: ch<{
      a2s21: send<{ a2s21: 'a2s21' }, { a2s21_r: 'a2s21_r' }>
      a2s22: send<{ a2s22: 'a2s22' }, { a2s22_r: 'a2s22_r' }> //{ a2s11_r: 'a2s11_r' }>
      a2s23: send<{ a2s23: 'a2s23' }> //{ a2s12_r: 'a2s12_r' }>
    }>
  }
  config: { a: number }
}>

export const ctrl: mod_ctrl<def> = {
  chr2: {
    async a2r21(pl) {
      pl.a2r21
      // return {status:'done',reply:{a2r11_r:'a2r11_r'}}
      // return ['done', { a2r21_r: 'a2r21_r', message:'',aerr:'' }]
      return { a2r21_r: 'a2r21_r' }
    },
    async a2r23(pl) {
      pl.a2r23
      // return {status:'done',reply:{a2r11_r:'a2r11_r'}}
    },
    async a2r22(pl) {
      pl.a2r22
      // return {status:'done',reply:{a2r11_r:'a2r11_r'}}
      return { a2r22_r: 'a2r22_r' }
    },
  },
  chr1: {
    async a2r11(pl) {
      pl.a2r11
      // return {status:'done',reply:{a2r11_r:'a2r11_r'}}
      return { a2r11_r: 'a2r11_r' }
      // return {status:'done',reply:{a2r11_r:'a2r11_r'}}
    },
    async a2r13(pl) {
      pl.a2r13
      // pl.a2r12
      // return {status:'done',reply:{a2r11_r:'a2r11_r'}}
    },
    async a2r12(pl) {
      pl.a2r12
      // return {status:'done',reply:{a2r11_r:'a2r11_r'}}
      return { a2r12_r: 'a2r12_r' }
    },
  },
}
