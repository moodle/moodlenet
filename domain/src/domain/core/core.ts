import * as accessControl from '../model/accessControl.model/core'
// import { admin } from '../userType/admin.userType/admin.userType.core'
// import { authenticated } from '../userType/authenticated.userType/authenticated.userType.core'
// import { moderator } from '../userType/moderator.userType/moderator.userType.core'

export const branch: moo.def.core = {
  admin: async () => ({}),
  authenticated: async () => ({}),
  moderator: async () => ({}),
  anonymous: async () => ({}),
  any: async () => ({
    accessControl: accessControl.any_core,
  }),
  // authenticated,
  // admin,
  // moderator,
}
