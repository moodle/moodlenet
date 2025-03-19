/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { modelUpgradeData } from './types'

const MODEL_NAME = 'statics'

declare global {
  namespace moo {
    interface Models {
      [MODEL_NAME]: statics
    }
    namespace Models {
      namespace statics {
        type all = {
          env: Env
          configs: Configs
          schemas: Schemas
        }
        interface Env {}
        interface Configs {}
        interface Schemas {}
      }
    }
  }
}

export type statics = moo.def.model<staticsModel>

type _all = moo.Models.statics.all
export type staticsModel = {
  data: {
    kind: {
      put: moo.def.model.op<['sync', <kind extends keyof _all>(_: { kind: kind; data: _all[kind] }) => Promise<void>]>
      get: moo.def.model.op<['query', <kind extends keyof _all>(_: { kind: kind }) => Promise<{ data: _all[kind] }>]>
    }
    ns: {
      put: moo.def.model.op<['sync', <kind extends keyof _all, ns extends keyof _all[kind]>(_: { kind: kind; ns: ns; data: _all[kind][ns] }) => Promise<void>]>
      get: moo.def.model.op<['query', <kind extends keyof _all, ns extends keyof _all[kind]>(_: { kind: kind; ns: ns }) => Promise<{ data: _all[kind][ns] }>]>
    }
    type: {
      put: moo.def.model.op<
        [
          'sync',
          <kind extends keyof _all, ns extends keyof _all[kind], type extends keyof _all[kind][ns]>(_: {
            kind: kind
            ns: ns
            type: type
            data: _all[kind][ns][type]
          }) => Promise<void>,
        ]
      >
      get: moo.def.model.op<
        [
          'query',
          <kind extends keyof _all, ns extends keyof _all[kind], type extends keyof _all[kind][ns]>(_: {
            kind: kind
            ns: ns
            type: type
          }) => Promise<{ data: _all[kind][ns][type] }>,
        ]
      >
    }
  }
  latestModelUpgrade: {
    get: moo.def.model.op<['query', void, null | modelUpgradeData]>
    save: moo.def.model.op<['sync', modelUpgradeData, void]>
  }
}
