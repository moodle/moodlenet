import * as accessControl from '../model/accessControl.model/gate'

export const gateProvider: moo.def.gate.provider = {
  any: () => ({
    accessControl: accessControl.any_gate,
  }),
  anonymous: () => ({}),
  admin: () => ({}),
  authenticated: () => ({}),
  moderator: () => ({}),
}
