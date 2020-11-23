import { Topic, TopicArg, bind, TopicType, TopicOf } from './d'
//@ts-expect-error
type _ = TopicType<any, ''>

type MYDOM = {
  a: {
    b: {
      c: {
        d: TopicArg<TopicType<MYDOM, 'm.n.r'>, { r: string }>
        k: TopicArg<TopicType<MYDOM, 'm.n.s'>, { r: string }>
      }
      e: {
        f: TopicArg<{ f: number }, { r: string }>
      }
      j: {
        j: TopicArg<{ s: number }, { r: string }>
      }
    }
  }
  m: {
    n: {
      o: {
        p: {}
      }
      r: TopicArg<{ r: string }, { r: number }>
      s: Topic<{ s: number }, { s: string }>
      t: Topic<{ r: string }>
    }
  }
}

type n = MYDOM['m']['n']

const aa = bind<MYDOM>()(['m.n.r', 'sas'], ['a.b.c.q', ''])
const aa = bind<MYDOM>()(['m.n.r', 'sas'], ['a.b.c.d', ''])
const aa = bind<MYDOM>()(['m.n.s'], ['a.b.c.d', ''])
const bb = bind<MYDOM>()(['m.n.r', 'sas'], ['a.b.e.f', 'sas'])
const cc = bind<MYDOM>()(['m.n.r', ''], ['a.b.j.j', 'ss'])

bind<MYDOM>()(['m.n.s'], ['a.b.j.j', ''])
