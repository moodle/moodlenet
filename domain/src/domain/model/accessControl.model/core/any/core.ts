import { any_def } from '../../gate'

// export const _any: moo.def.core.branch<anyUserTypeModelDef> = async ({ coreRequest, configs: _configs }) => ({
//   policies: async ({ configs: _configs }) => ({
//     readMyOwn: async ({ configs: _configs }) => ({
//       policiesInfo: async ({ configs: _configs }) => ({
//         fn: async _ => ({ policiesInfo: coreRequest.policiesInfo }),
//       }),
//     }),
//   }),
// })

export const any_core: moo.def.core.node<any_def> = async M => ({
  _: { m1: M.configs.m + '*' },
  policies: async S => ({
    _: { s1: S.configs.s + '*' },
    readMyOwn: async U => ({
      _: { u1: U.configs.u + '*' },
      policiesInfo: async E => ({
        _: { e1: E.configs.e + '*' },
        //  _: ({ ae1: E.configs.e }),
        $: async _ => ({ policiesInfo: E.request.userPoliciesInfo }),
      }),
    }),
  }),
})

// export const __any: moo.def.core.branch<anyUserTypeModelDef> = async ({ coreRequest, configs }) => {
//   return {
//     _some:some( { m1: configs.m },),
//     policies: async ({ configs }) => {
//       return {
//         _some:some( { s1: configs.s },),
//         readMyOwn: async ({ configs }) => {
//           return {
//             _some:some( { u1: configs.u },),
//             policiesInfo: async ({ configs }) => {
//               return {
//                 _some:some( { e1: configs.e },),
//                 fn: async _ => ({ policiesInfo: coreRequest.policiesInfo }),
//               }
//             },
//           }
//         },
//       }
//     },
//   }
// }
