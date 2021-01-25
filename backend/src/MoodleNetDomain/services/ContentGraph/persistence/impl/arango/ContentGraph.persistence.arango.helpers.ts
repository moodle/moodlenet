import { Context } from '../../../../../MoodleNetGraphQL'
import { NodeRead } from '../../../ContentGraph.access.types'
import { Role } from '../../../ContentGraph.graphql.gen'

export const isTypename = <Type extends { __typename: string }>(
  maybeSome: any,
  __typename: Type['__typename']
): maybeSome is Type =>
  !maybeSome ? false : maybeSome.__typename === __typename

export const createMeta = ({ userId }: { userId: string }) => {
  return `{
      __typename: 'Meta',
      created: ${byAtNow({ userId })},
      lastUpdate: ${byAtNow({ userId })}
    }`
}

export const mergeLastUpdateMeta = ({
  nodeVar,
  userId,
}: {
  userId: string
  nodeVar: string
}) => {
  return `MERGE( ${nodeVar}._meta, {
      lastUpdate: MERGE( ${nodeVar}._meta.lastUpdate,
        ${byAtNow({ userId })}
      )
    })`
}

export const byAtNow = ({ userId }: { userId: string }) => {
  return `{
        __typename: 'ByAt',
        at: DATE_NOW(),
        by: { _id: ${stringify(userId)} }
      }`
}

export const getNodeAccessFilter = ({
  nodeRead,
  ctx,
  nodeVar,
}: {
  nodeRead: NodeRead
  ctx: Context
  nodeVar: string
}) => {
  if (nodeRead === NodeRead.Public) {
    return ` true `
  } else if (!ctx.auth) {
    return ` false `
  } else {
    const iAmCreator = ` ${nodeVar}._meta.created.by._id == "${ctx.auth.userId}" `
    const iAmAdmin = ctx.auth.role === Role.Admin
    if (nodeRead === NodeRead.User) {
      return ` true `
    } else if (nodeRead === NodeRead.Protected) {
      return ` ( ${iAmAdmin} || ${iAmCreator} ) `
    } else if (nodeRead === NodeRead.Private) {
      return ` ${iAmCreator} `
    } else {
      // nodeRead : never
      throw new Error(`unknown NodeRead: ${nodeRead}`)
    }
  }
}

export const stringify = (_: any) => JSON.stringify(_)
