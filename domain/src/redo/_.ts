/* eslint-disable @typescript-eslint/no-invalid-void-type */
/* eslint-disable @typescript-eslint/no-namespace */

import { any_ } from '@moodle/lib-types'

type _Ep = moodle.UseCase_Endpoint_Impl<[{ a: number }, { x: number }]>

export const coreEp1: _Ep = async (_u, _ctx) => {
  return [{ a: 3 }, async _message => ({ x: _message.a + 1 })]
}

declare global {
  namespace moodle {
    interface Modules {
      ciccio: Module<{
        useCases: {
          some: {
            epx: [void, { x: string }]
            ep1: [{ a: number }, { x: string }]
            ep2: [{ b: number }, { c: boolean }]
          }
        }
        model: {
          stCosa: StaticData<{ statica: string }>
          a: IdSpaceMap<{
            b: FsFile
            u: Endpoint<[{ aNumber: number }, { res: string }]>
            as: Endpoint<[{ aNumber: number }, { res: string }, 'sync' & 'async']>
            s: Endpoint<[{ aNumber: number }, { res: string }, 'sync']>
            a: Endpoint<[{ aNumber: number }, { res: string }, 'async']>
            info: DataEntity<{ name: string }, { isAdmin: boolean }>
            sub: IdSpaceMap<{
              cosa: DataEntity<{ lolo: string }>
            }>
          }>
        }
      }>
    }
  }
}

declare const _cor_: moodle.Module_Impl<moodle.Modules['ciccio']>
_cor_.useCases.some
  .ep1({}, { m: null as any_, q: null as any_, s: () => null as any_ })
  .then(([{ a }, f]) => f({ a }))
  .then(({ x: _x }) => null)

const _cor: moodle.Module_Impl<moodle.Modules['ciccio']> = {
  useCases: {
    some: {
      async ep1(_u, x) {
        const _ = x.s(x.m.ciccio.a.asas?.b).meta()
        const _x = x.s(x.m.ciccio.a.asas?.b).meta()
        const _sax = x.q(x.m.ciccio.a.asas?.info).get({ cond: { isAdmin: false } })
        const _saax = x.s(x.m.ciccio.a.asas?.sub.sa?.cosa).get()
        const _found = x.s(x.m.ciccio.a).exists({ id: 'asaa' })
        const _st = x.s(x.m.ciccio.stCosa).get()
        const _repl = x.s(x.m.ciccio.a.asas?.info).get()

        const _uq = x.q(x.m.ciccio.a.asas?.u).send({ aNumber: 321 })
        const _us = x.s(x.m.ciccio.a.asas?.u).send({ aNumber: 321 })

        const _asq = x.q(x.m.ciccio.a.asas?.as).send({ aNumber: 321 })
        const _ass = x.s(x.m.ciccio.a.asas?.as).send({ aNumber: 321 })

        const _sq = x.q(x.m.ciccio.a.asas?.s).send({ aNumber: 321 })
        const _ss = x.s(x.m.ciccio.a.asas?.s).send({ aNumber: 321 })

        const _aq = x.q(x.m.ciccio.a.asas?.a).send({ aNumber: 321 })
        //@ts-expect-error : this is async only
        const _as = x.s(x.m.ciccio.a.asas?.a).send({ aNumber: 321 })

        //  return [false,{reason:'invalidMessage'}]
        return [
          { a: 3 },
          async _message => {
            return { x: '' }
          },
        ]
      },
      async ep2(_u, _ctx) {
        return [{ b: 3 }, async _message => ({ c: !_message.b })]
      },
      async epx(_u, _ctx) {
        return [void 0, async _message => ({ x: '' })]
      },
    },
  },
}
declare const _pri: moodle.PrimaryAccess
declare const _dom: moodle.Domain

const _p1 = _pri.ciccio.some.ep1({ a: 1 })
const _p2 = _pri.ciccio.some.ep2({ b: 1 })
_pri.ciccio

const _epp = _dom.model.ciccio.a.hd6a8e?.as
