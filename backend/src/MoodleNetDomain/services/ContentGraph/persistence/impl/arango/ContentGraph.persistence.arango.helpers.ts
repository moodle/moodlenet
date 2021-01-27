import {
  BasicAccessFilterEngine,
  BasicAccessPolicyTypeFilters,
  NeedsAuthFilter,
} from '../../../graphDefinition/helpers'
import { GlyphTag } from '../../../graphDefinition/types'
import { Types } from '../../types'

export const createMeta = ({ userId }: { userId: string }) => {
  return `{
      __typename: 'Meta',
      created: ${byAtNow({ userId })},
      lastUpdate: ${byAtNow({ userId })}
    }`
}

export const mergeLastUpdateMeta = ({
  glyphTag,
  userId,
}: {
  userId: string
  glyphTag: GlyphTag
}) => {
  return `MERGE( ${glyphTag}._meta, {
      lastUpdate: MERGE( ${glyphTag}._meta.lastUpdate,
        ${byAtNow({ userId })}
      )
    })`
}

export const byAtNow = ({ userId }: { userId: string }) => {
  return `{
        __typename: 'ByAt',
        at: DATE_NOW(),
        by: { _id: ${aqlstr(userId)} }
      }`
}

export const needsAuthFilter: NeedsAuthFilter<string> = (filterWithAuth) => ({
  ctx,
  glyphTag,
}) => (ctx.auth ? filterWithAuth({ ctx, auth: ctx.auth, glyphTag }) : 'false')

export const basicAccessPolicyTypeFilters: BasicAccessPolicyTypeFilters<string> = {
  Admins: needsAuthFilter(({ auth }) =>
    auth.role === Types.Role.Admin ? 'true' : 'false'
  ),
  AnyUser: needsAuthFilter(() => 'true'),
  Creator: needsAuthFilter(
    ({ auth, glyphTag }) =>
      `${glyphTag}._meta.created.by._id == "${auth.userId}"`
  ),
  Moderator: needsAuthFilter(({ auth }) =>
    auth.role === Types.Role.Moderator ? 'true' : 'false'
  ),
  Public: () => 'true',
}

export const basicAccessFilterEngine: BasicAccessFilterEngine<string> = {
  andReducer: (a, b) => (a === undefined ? ` ${b} ` : ` ${a} && ${b} `),
  orReducer: (a, b) => (a === undefined ? ` ${b} ` : ` ${a} || ${b} `),
  basicAccessPolicyTypeFilters,
}

export const aqlstr = (_: any) => JSON.stringify(_)
