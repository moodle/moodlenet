export const isTypename = <Type extends { __typename: string }>(
  maybeSome: any,
  __typename: Type['__typename']
): maybeSome is Type =>
  !maybeSome ? false : maybeSome.__typename === __typename

export const createMeta = ({
  creatorUserId: userId,
}: {
  creatorUserId: string
}) => {
  return `_meta: {
      __typename:'Meta',
      created:{
        __typename: 'ByAt',
        at: DATE_NOW(),
        by: { _id: '${userId}' }
      },
      lastUpdate:{
        __typename: 'ByAt',
        at: DATE_NOW(),
        by: { _id: '${userId}' }
      }
    }`
}

export const updateMeta = ({
  nodeVar: v,
  updateUserId: userId,
}: {
  updateUserId: string
  nodeVar: string
}) => {
  return `_meta: MERGE( ${v}._meta, {
      lastUpdate: MERGE( ${v}._meta.lastUpdate, {
        at: DATE_NOW(),
        by: { _id: '${userId}' }
      })
    })`
}
