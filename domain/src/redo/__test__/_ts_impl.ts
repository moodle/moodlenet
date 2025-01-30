import { left, right } from 'fp-ts/Either'
import * as moo from '../moodle-domain'
// import { CONDITIONS_NOT_MET } from '../lib/types'

const _cor: moo.PersonaCore<'ciccio'> = x =>
  right({
    some: right({
      ep1: right([
        u => right(u as { a: number }),
        async ({ a }) => {
          //@ts-expect-error: //NOTE: a is a number
          const _s: string = a
          const _n: number = a

          // const _asset_ = x.on(x.moo.ciccio.aIdsm.asas?.asset)
          // const _asset = x.on(x.moo.ciccio.aIdsm.asas?.asset).remove.async()
          // const _ = x.on(x.moo.ciccio.aIdsm.asas?.a_bFile)
          // const _x = x.on(x.moo.ciccio.aIdsm.asas?.a_bFile).meta.query()
          // const _sax = x.on(x.moo.ciccio.aIdsm.asas?.a_info).get.query({ asLongAs: { isAdmin: false } })
          const _saax__ = x.on(x._.aIdsm.asas?.a_sub.sa?.a_subCosa)
          const _saax = x.on(x._.aIdsm.asas?.a_sub.sa?.a_subCosa).get.query()
          const _saaxs = x
            .on(x._.aIdsm.asas?.a_sub.sa?.a_subCosa)
            .replace.async({ newData: { lolo: '' }, conditions: { x: 2 } })
          const _found = x.on(x._.aIdsm.aaa).exists.query()
          const _st = x.on(x._.stCosa).get.query()
          // const _repl = x.on(x.moo.ciccio.aIdsm.asas?.a_info).get.query()

          const _uqqq = x.on(x._.stEp).do.query({ aNumber: 321 })
          // const ___u = x.on(x.moo.ciccio.b.buEp)
          // const _uq = x.on(x.moo.ciccio.b.buEp).do.async({ aNumber: 321 })

          // const _ass = x.on(x.moo.ciccio.b.basEp).do.query({ aNumber: 321 })

          // const _sq = x.on(x.moo.ciccio.b.bsEp).do.sync({ aNumber: 321 })
          // const _ss = x.on(x.moo.ciccio.b.bsEp).do.async({ aNumber: 321 })

          // const _aq = x.on(x.moo.ciccio.aIdsm.asas?.a_ep).do.async({ aNumber: 321 })

          const _asa = x.on(x._.aIdsm.asas?.a_ep).do.async({ aNumber: 321 })

          //@ts-expect-error: //NOTE: @ts-expect-error this is async only !!!!!!!!!!!!!!!11
          const _as_ = x.on(x._.aIdsm.asas?.a_ep).do.sync({ aNumber: 321 })
          //NOTE: @ts-expect-error ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

          //  return [false,{reason:'invalidMessage'}]
          return { x: '' }
        },
      ]),
      ep2: right([
        _u => right({ b: 4 }),
        async _message => {
          return { c: !_message.b }
        },
      ]),
      epx:
        x.on !== x.on
          ? left({ message: 'forbidden', a: 10101 })
          : right([
              () => right(void 0),
              async _message => {
                return { x: '' }
              },
            ]),
    }),
  })
declare const _pri: moo.PrimaryAccess
declare const _dom: moo.Domain

declare const _ctx: moo.PersonaCtx<moo.Personas['ciccio']>

const _p12 = _pri.authenticated.accessSystem.logout()
const _p1 = _pri.ciccio.some.ep1({ a: 1 })
const _p2 = _pri.ciccio.some.ep2({ b: 1 })
_pri.ciccio

// export const w: moo.ModuleModel_Impl<'ciccio'>['b']['c'] = {
//   // export const w: moo.Model<moo.WholeModel['ciccio']['b']['c']> = {
//   buEp: {
//     [moo.OPS]: {
//       do: {
//         cmd: async ({ aNumber }) => ({ res: `${aNumber}` }),
//       },
//     },
//   },
// }

// export const _x: moo.Model_Impl = {
//   // user: moo.NO_JOB_HERE,
//   // admin: moo.NO_JOB_HERE,
//   // userIdEmailPassword: moo.NO_JOB_HERE,
//   emailSignup: moo.NO_JOB_HERE,
//   moodlenet: moo.NO_JOB_HERE,
//   org: moo.NO_JOB_HERE,
//   userHome: moo.NO_JOB_HERE,
//   ciccio: {
//     stCosa: {
//       [moo.OPS]: {
//         get: {
//           query: async () => ({ statica: '2' }),
//           then: async ({ statica: _statica }, _) => void 0,
//         },
//         replace: {
//           async cmd({ newData: _newData }) {
//             return
//           },
//         },
//       },
//     },
//     stEp: {
//       [moo.OPS]: {
//         do: {
//           query: async ({ aNumber }) => ({ res: `${aNumber}` }),
//           then: async (_a, _b) => void 0,
//         },
//       },
//     },
//     b: {
//       basEp: moo.NO_JOB_HERE,
//       bsEp: moo.NO_JOB_HERE,
//       c: {
//         buEp: moo.NO_JOB_HERE,
//       },
//     },
//     aIdsm: {
//       [moo.OPS]: {
//         subset: moo.NO_JOB_HERE,
//       },
//       _: _aId => {
//         return {
//           [moo.OPS]: {
//             getSpaceData: moo.NO_JOB_HERE,
//             purge: {
//               cmd: async () => right('done'),
//             },
//             exists: {
//               query: async () => ({ exists: true }),
//               then: async ({ exists: _exists }) => void 0,
//             },
//           },
//           a_ep: moo.NO_JOB_HERE,
//           a_sub: {
//             [moo.OPS]: {
//               subset: moo.NO_JOB_HERE,
//             },
//             _: _aId => {
//               return {
//                 [moo.OPS]: {
//                   getSpaceData: moo.NO_JOB_HERE,
//                   purge: {
//                     cmd: async () => right('done'),
//                   },
//                   exists: {
//                     query: async () => ({ exists: true }),
//                     // then: async ({ exists: _exists }, { id: _id }) => void 0,
//                   },
//                 },
//                 a_subCosa: {
//                   [moo.OPS]: {
//                     get: {
//                       query: async () => right({ lolo: _aId }),
//                       then: async (_, __) => void 0,
//                     },
//                     replace: {
//                       cmd: async ({ newData: { lolo: _lolo } }) => left({ message: CONDITIONS_NOT_MET }),
//                       // then: async (_, __) => void 0,
//                     },
//                   },
//                 },
//               }
//             },
//           },
//         }
//       },
//     },
//   },
// }
// export const y: moo.Model_Impl = {
//   // user: moo.NO_JOB_HERE,
//   // userIdEmailPassword: moo.NO_JOB_HERE,
//   // admin: moo.NO_JOB_HERE,
//   emailSignup: moo.NO_JOB_HERE,
//   ciccio: moo.NO_JOB_HERE,
// }
// export const z: moo.Model_Impl = {
//   // admin: moo.NO_JOB_HERE,
//   // user: moo.NO_JOB_HERE,
//   // userIdEmailPassword: moo.NO_JOB_HERE,
//   emailSignup: moo.NO_JOB_HERE,
//   ciccio: {
//     stCosa: moo.NO_JOB_HERE,
//     stEp: moo.NO_JOB_HERE,
//     b: moo.NO_JOB_HERE,
//     aIdsm: moo.NO_JOB_HERE,
//   },
// }
