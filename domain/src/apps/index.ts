import { _t, appEmitter, apps, controller, ctrl, priAccess, pusher, secAccess } from '@moodle/types'
import net from './net'
// import net2 from './net2'

export interface Moodle {
  net: net
  // net2: net2
}

type moodle = apps<_t<Moodle>>

declare const p: priAccess<moodle>
declare const s: secAccess<moodle>
declare const e: appEmitter<moodle>
declare const h: pusher<moodle>
const c: controller<moodle>

c('net', 'chr1', 'a1r11', { a1r11: 'a1r11' }).then(_ => {})

h('emits')('net', 'che1', 'a1e12', { a1e12: 'a1e12' }).then(_ => {})
h('sends')('net', 'chs1', 'a1s11', { a1s11: 'a1s11' }).then(_ => {})
h('receives')('net', 'chr2', 'a1r22', { a1r22: 'a1r22' }).then(_ => {})
h('receives')('net', 'chr2', 'a1r23', { a1r23: 'a1r23' }).then(_ => {})

e('net', 'che1', 'a1e12', { a1e12: 'a1e12' }).then(_ => {})

s('net', 'evt')('ch11', 'e12', { e12: 'e12' }).then(_ => {})

s('net', 'ch11', 'e12', { e12: 'e12' }).then(_ => {})
s('net', 'ch11', 'e11', { e11: 'e11' }).then(_ => {})

s('net', 'ch12', 'e14', /* 'evt', */ { e14: 'e14' }).then(_ => {})
s('net', 'ch12', 'e14', /* 'evt', */ { e14: 'e14' }).then(_ => {})

s('net', 'ch11', 'e11', /* 'pri', */ { e11: 'e11' }).then(_ => {})
s('net', 'ch12', 'e13', /* 'sec', */ { e13: 'e13' }).then(_ => {})
s('net2', 'ch21', 'e22', /* 'sec', */ { e22: 'e22' }).then(_ => {})
s('net/ch11/pri/e11').then(_ => {})
s('net', {
  ch: 'p11',
  name: 'p12',
  pl: { p12: 'p12' },
}).then(reply => {})

declare const ct: ctrl<moodle>
ct.receive((app, op, ch, pl) => {
  switch (app) {
    case 'net': {
      switch (op) {
        case 'p1': {
          pl
        }
      }
    }
  }
})

export default moodle
