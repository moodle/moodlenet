import { BasicAccessFilterEngine, BasicAccessPolicyTypeFilters, NeedsAuthFilter } from '../../graphDefinition/helpers'

export const needsAuthFilter: NeedsAuthFilter<string> = filterWithAuth => ({ ctx, glyphTag }) =>
  ctx.type === 'session' ? filterWithAuth({ ctx, glyphTag }) : 'false'

export const basicArangoAccessPolicyTypeFilters: BasicAccessPolicyTypeFilters<string> = {
  Admins: needsAuthFilter(() => 'true'),
  AnyProfile: needsAuthFilter(() => 'true'),
  Creator: needsAuthFilter(() => 'true'),
  Moderator: needsAuthFilter(() => 'true'),
  Public: () => 'true',
}

export const basicArangoAccessFilterEngine: BasicAccessFilterEngine<string> = {
  andReducer: (a, b) => (a === undefined ? ` ${b} ` : ` ${a} && ${b} `),
  orReducer: (a, b) => (a === undefined ? ` ${b} ` : ` ${a} || ${b} `),
  basicAccessPolicyTypeFilters: basicArangoAccessPolicyTypeFilters,
}
