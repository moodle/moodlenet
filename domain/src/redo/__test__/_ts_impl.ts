import { any_ } from '@moodle/lib-types'
import * as m from '../moodle-domain'

declare const _cor_: m.Core<'ciccio'>
_cor_.useCases.some
  .ep1({}, { m: null as any_, on: () => null as any_ })
  .then(([{ a }, f]) => f({ a }))
  .then(({ x: _x }) => null)

const _cor: m.Core<'ciccio'> = {
  useCases: {
    some: {
      async ep1(_u, x) {
        // const _asset_ = x.on(x.m.ciccio.aIdsm.asas?.asset)
        // const _asset = x.on(x.m.ciccio.aIdsm.asas?.asset).remove.async()
        // const _ = x.on(x.m.ciccio.aIdsm.asas?.a_bFile)
        // const _x = x.on(x.m.ciccio.aIdsm.asas?.a_bFile).meta.query()
        // const _sax = x.on(x.m.ciccio.aIdsm.asas?.a_info).get.query({ asLongAs: { isAdmin: false } })
        const _saax = x.on(x.m.ciccio.aIdsm.asas?.a_sub.sa?.a_subCosa).get.query()
        const _saaxs = x
          .on(x.m.ciccio.aIdsm.asas?.a_sub.sa?.a_subCosa)
          .replace.async({ newData: { lolo: '' }, conditions: { x: 2 } })
        const _found = x.on(x.m.ciccio.aIdsm).exists.query({ id: 'asaa' })
        const _st = x.on(x.m.ciccio.stCosa).get.query()
        // const _repl = x.on(x.m.ciccio.aIdsm.asas?.a_info).get.query()

        const _uqqq = x.on(x.m.ciccio.stEp).do.query({ aNumber: 321 })
        // const ___u = x.on(x.m.ciccio.b.buEp)
        // const _uq = x.on(x.m.ciccio.b.buEp).do.async({ aNumber: 321 })

        // const _ass = x.on(x.m.ciccio.b.basEp).do.query({ aNumber: 321 })

        // const _sq = x.on(x.m.ciccio.b.bsEp).do.sync({ aNumber: 321 })
        // const _ss = x.on(x.m.ciccio.b.bsEp).do.async({ aNumber: 321 })

        // const _aq = x.on(x.m.ciccio.aIdsm.asas?.a_ep).do.async({ aNumber: 321 })
        //@ts-expect-error : this is async only
        const _as = x.on(x.m.ciccio.aIdsm.asas?.a_ep).do.sync({ aNumber: 321 })

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
declare const _pri: m.PrimaryAccess
declare const _dom: m.Domain

const _p1 = _pri.ciccio.some.ep1({ a: 1 })
const _p2 = _pri.ciccio.some.ep2({ b: 1 })
_pri.ciccio

export const w: m.SubModel<'ciccio'>['b']['c'] = {
  // export const w: m.Model<m.WholeModel['ciccio']['b']['c']> = {
  buEp: {
    [m.OPS]: {
      do: {
        cmd: async ({ aNumber }) => ({ res: `${aNumber}` }),
      },
    },
  },
}

export const x: m.Model = {
  ciccio: {
    stCosa: {
      [m.OPS]: {
        get: {
          query: async () => ({ statica: '2' }),
          then: async ({ statica: _statica }, _) => void 0,
        },
      },
    },
    stEp: {
      [m.OPS]: {
        do: {
          query: async ({ aNumber }) => ({ res: `${aNumber}` }),
          then: async (_a, _b) => void 0,
        },
      },
    },
    b: {
      basEp: m.NO_JOB_HERE,
      bsEp: m.NO_JOB_HERE,
      c: {
        buEp: m.NO_JOB_HERE,
      },
    },
    aIdsm: {
      [m.OPS]: {
        exists: {
          query: async ({ id: _id }) => ({ exists: true }),
          then: async ({ exists: _exists }, { id: _id }) => void 0,
        },
      },
      _: _aId => {
        return {
          a_ep: m.NO_JOB_HERE,
          a_sub: {
            [m.OPS]: {
              exists: {
                query: async ({ id: _id }) => ({ exists: true }),
                // then: async ({ exists: _exists }, { id: _id }) => void 0,
              },
            },
            _: _aId => {
              return {
                a_subCosa: {
                  [m.OPS]: {
                    get: {
                      query: async () => ({ result: 'found', data: { lolo: _aId } }),
                      then: async (_, __) => void 0,
                    },
                    replace: {
                      cmd: async ({ newData: { lolo: _lolo } }) => ({ result: 'done' }),
                      // then: async (_, __) => void 0,
                    },
                  },
                },
              }
            },
          },
        }
      },
    },
  },
}
export const y: m.Model = {
  ciccio: m.NO_JOB_HERE,
}
export const z: m.Model = {
  ciccio: {
    stCosa: m.NO_JOB_HERE,
    stEp: m.NO_JOB_HERE,
    b: m.NO_JOB_HERE,
    aIdsm: m.NO_JOB_HERE,
  },
}
