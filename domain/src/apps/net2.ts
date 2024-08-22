import { app, ch, msg } from '@moodle/types'

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

// p12: { msg: { pl: { p12: 'p12' } }; op: { op: 'pri'; re: { p12: 'p12' } } }
// s11: { msg: { pl: { s11: 's11' } }; op: { op: 'sec'; re: { s11: 's11' } } }
// s12: { msg: { pl: { s12: 's12' } }; op: { op: 'sec'; re: { s12: 's12' } } }
// e21: { msg: { pl: { e21: 'e21' } } }
// e22: { msg: { pl: { e22: 'e22' } } }
type e21 = msg<{ p: { e21: 'e21' } }, { t: 'pri'; r: { r21: 'r21' } }>
type e22 = msg<{ p: { e22: 'e22' } }, { t: 'sec'; r: { r22: 'r22' } }>
type e23 = msg<{ p: { e23: 'e23' } }, { t: 'sec' }>
type e24 = msg<{ p: { e24: 'e24' } }, { t: 'pri' }>
type ch21 = ch<{
  e21: e21
  e22: e22
}>

type ch22 = ch<{
  e23: e23
  e24: e24
}>

type moodlenet_app = app<{
  ch21: ch21
  ch22: ch22
}>

/*
p11: [{ ch: 'p11'; pl: { p11: 'p11' } }, { op: 'pri'; re: { p11: 'p11' } }]
p12: [{ ch: 'p12'; pl: { p12: 'p12' } }, { op: 'pri'; re: { p12: 'p12' } }]
s11: [{ ch: 's11'; pl: { s11: 's11' } }, { op: 'sec'; re: { s11: 's11' } }]
s12: [{ ch: 's12'; pl: { s12: 's12' } }, { op: 'sec'; re: { s12: 's12' } }]
e21: [{ ch: 'e21'; pl: { e21: 'e21' } }]
e22: [{ ch: 'e22'; pl: { e22: 'e22' } }]
*/

export default moodlenet_app
