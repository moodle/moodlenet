import { void as voidz } from 'zod'
import { any_def } from './def'

export const any_gate: moo.def.gate.provider.node<any_def> = (_modelConfigs, _modelContext) => /* right */ ({
  policies: (_scopeConfigs, _scopeContext) => /* right */ ({
    readMyOwn: (_usecaseConfigs, _useCaseContext) => /* right */ ({
      policiesInfo: (_endpointConfigs, _endpointContext) => {
        return /* right */ {
          zod: voidz(), //.refine(...contexts...)
          // context: {
          //   check: () => right(0),
          //   preflight: _void_form => right(0),
          // },
        }
      },
    }),
  }),
})
