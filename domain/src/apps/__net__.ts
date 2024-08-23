import { ch, event, mod, receive, send } from '@moodle/types'

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
    basePath: string
  }
}
type a1s11 = send<{ a1s11: 'a1s11' }, { a1s11_r: 'a1s11_r' }>
type a1s12 = send<{ a1s12: 'a1s12' }, { a1s12_r: 'a1s12_r' }>
type a1s13 = send<{ a1s13: 'a1s13' }>
type a1r11 = receive<{ a1r11: 'a1r11' }, { a1r11_r: 'a1r11_r' }>
type a1r12 = receive<{ a1r12: 'a1r12' }, { a1r12_r: 'a1r12_r' }>
type a1r13 = receive<{ a1r13: 'a1r13' }>
type a1e11 = event<{ a1e11: 'a1e11' }>
type a1e12 = event<{ a1e12: 'a1e12' }>

type che1 = ch<{
  a1e11: event<{ a1e11: 'a1e11' }> //{ a1s12_r: 'a1s12_r' }>
  a1e12: event<{ a1e12: 'a1e12' }> //{ a1s12_r: 'a1s12_r' }>
}>

type chs1 = ch<{
  a1s11: send<{ a1s11: 'a1s11' }, { a1s11_r: 'a1s11_r' }>
  a1s12: send<{ a1s12: 'a1s12' }, { a1s12_r: 'a1s12_r' }>
  a1s13: send<{ a1s13: 'a1s13' }> //{ a1s12_r: 'a1s12_r' }>
}>

type chr1 = ch<{
  a1r11: receive<{ a1r11: 'a1r11' }, { a1r11_r: 'a1r11_r' }>
  a1r12: receive<{ a1r12: 'a1r12' }, { a1r12_r: 'a1r12_r' }>
  a1r13: receive<{ a1r13: 'a1r13' }> //{ a1s12_r: 'a1s12_r' }>
}>

type che2 = ch<{
  a1e21: event<{ a1e21: 'a1e21' }> //{ a1s12_r: 'a1s12_r' }>
  a1e22: event<{ a1e22: 'a1e22' }> //{ a1s12_r: 'a1s12_r' }>
}>

type chs2 = ch<{
  a1s21: send<{ a1s21: 'a1s21' }, { a1s21_r: 'a1s21_r' }>
  a1s22: send<{ a1s22: 'a1s22' }, { a1s22_r: 'a1s22_r' }> //{ a1s11_r: 'a1s11_r' }>
  a1s23: send<{ a1s23: 'a1s23' }> //{ a1s12_r: 'a1s12_r' }>
}>

type chr2 = ch<{
  a1r21: receive<{ a1r21: 'a1r21' }, { a1r21_r: 'a1r21_r' }>
  a1r22: receive<{ a1r22: 'a1r22' }, { a1r22_r: 'a1r22_r' }>
  a1r23: receive<{ a1r23: 'a1r23' }> //{ a1s12_r: 'a1s12_r' }>
}>
type moodlenet_mod = mod<{
  receive: { chr1: chr1; chr2: chr2 }
  emit: { che1: che1; che2: che2 }
  send: { chs1: chs1; chs2: chs2 }
  config: { a: number }
}>

export default moodlenet_mod
