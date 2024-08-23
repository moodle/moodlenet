import { _t, ctrl, modEmitter, mods, priAccess, pusher, secAccess } from 'domain/src/src'
import * as net from './net'
import * as net2 from './net2'

export interface Moodle {
  net: net.def
  net2: net2.def
}

type moodle = mods<_t<Moodle>>

const c: ctrl<moodle> = {
  net: net.ctrl,
  net2: net2.ctrl,
}

declare const p: priAccess<moodle>
declare const s: secAccess<moodle>
declare const e: modEmitter<moodle>
declare const h: pusher<moodle>
c({
  mod: 'net',
  ch: 'chr1',
  ev: 'a1r11',
  payload: { a1r11: 'a1r11' },
}).then(_ => {
  _.status === 'done' ? _.reply : 1
})

h('receives')({
  mod: 'net',
  ch: 'chr2',
  ev: 'a1r22',
  payload: { a1r22: 'a1r22' },
}).then(_ => {
  _.status === 'done' ? _.reply.a1r22_r.charAt : 0
})

h('receives')({
  mod: 'net',
  ch: 'chr1',
  ev: 'a1r12',
  payload: { a1r12: 'a1r12' },
}).then(([s, p]) => {
  if (s) {
    p.a1r12_r.charCodeAt
  } else {
    p.code === 'forbidden'
  }
})

h('receives')('net2', 'chr1', 'a2r11', { a2r11: 'a2r11' }).then(_ => {
  _.s === 'ok' && _
})
h('receives')('net', 'chr1', 'a1r13', { a1r13: 'a1r13' }).then(_ => {
  _.s === 'ok' && _
})
h('receives')('net', 'chr2', 'a1r22', { a1r22: 'a1r22' }).then(_ => {
  _.s === 'ok' && _.r.a1r22_r
})
h('receives')('net2', 'chr2', 'a2r21', { a2r21: 'a2r21' }).then(_ => {})
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
ct.receive((mod, op, ch, pl) => {
  switch (mod) {
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
