export function getFullPoliciesConfigTree(_schemas: Pick<moo.Models.statics.Schemas, 'org' | 'moodlenet' | 'userHome'>) {
  // userHome.schemas.configs.eduDraftsOverrides
  // education.schemas.configs.collection
  const config: moo.def.policies.config.tree = {
    moderator: {},
    authenticated: {},
    admin: {},
    anonymous: {},
    any: {
      accessControl: {
        _: { m: '' },
        policies: {
          _: { s: '' },
          readMyOwn: {
            _: { u: '' },
            policiesInfo: {
              _: { e: '' },
            },
          },
        },
      },
    },
  }
  return config
}

// export function deriveUnconfigured(config: moo.policies.config.tree): moo.policies.override.tree {
//   return Object.entries(config).reduce((acc, [prop, val]) => {
//     if (prop === '_') {
//       return acc
//     }
//     acc[prop] = deriveUnconfigured(val as any_)
//     return acc
//   }, {} as any_)
// }
