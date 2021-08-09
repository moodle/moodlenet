import { GraphEdgeByType, GraphEdgeType } from '@moodlenet/common/lib/content-graph/types/edge'
import { GraphNodeByType, GraphNodeIdentifierSlug, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { Page, PageInfo, PageItem, PaginationInput } from '@moodlenet/common/lib/content-graph/types/page'
import { AQ, aqlstr } from '../../../../lib/helpers/arango/query'
import { AqlGraphEdgeByType, AqlGraphNodeByType } from '../types'

export const cursorPaginatedQuery = <T>({
  page,
  cursorProp,
  inverseSort = false,
  mapQuery,
}: {
  page: PaginationInput
  cursorProp: string
  inverseSort?: boolean
  mapQuery(pageFilterSortLimit: string): AQ<T>
}) => {
  const { after, first, last, before } = page
  const beforeCursor = before || after
  const getCursorToo = beforeCursor === after

  const pageLimit = (_: number, pageType: 'after' | 'before') => _ + (pageType === 'before' && getCursorToo ? 1 : 0)

  const _afterPage =
    !after && !!before
      ? null
      : `${after ? `FILTER ${cursorProp} > ${aqlstr(after)}` : ``}
    SORT ${cursorProp} ${inverseSort ? 'DESC' : 'ASC'}
    LIMIT ${pageLimit(first, 'after')}
    `

  const beforeComparison = getCursorToo ? '<=' : '<'
  const _beforePage =
    last && beforeCursor
      ? `${beforeCursor ? `FILTER ${cursorProp} ${beforeComparison} ${aqlstr(beforeCursor)}` : ``}
        SORT ${cursorProp} ${inverseSort ? 'ASC' : 'DESC'}
        LIMIT ${pageLimit(last, 'before')}
      `
      : null

  return {
    beforePageQuery: _beforePage
      ? mapQuery(`
        ${_beforePage}
        LET cursor = ${cursorProp}
      `)
      : null,
    afterPageQuery: _afterPage
      ? mapQuery(`
        ${_afterPage}
        LET cursor = ${cursorProp}
      `)
      : null,
  }
}

export const makeAfterBeforePage = <T>({
  afterItems,
  beforeItems,
}: {
  afterItems: PageItem<T>[]
  beforeItems: PageItem<T>[]
}): Page<T> => {
  const items = beforeItems.reverse().concat(afterItems)
  return makePage({
    items,
    hasNextPage: !!afterItems.length,
    hasPreviousPage: !!beforeItems.length,
  })
}

export const makePage = <T>({
  items,
  hasNextPage,
  hasPreviousPage,
}: {
  items: PageItem<T>[]
  hasNextPage: boolean
  hasPreviousPage: boolean
}): Page<T> => {
  const [startCursor] = items[0] || []
  const [endCursor] = items[items.length - 1] || []
  const pageInfo: PageInfo = {
    startCursor,
    endCursor,
    hasNextPage,
    hasPreviousPage,
  }
  const page: Page<T> = {
    pageInfo,
    items,
  }
  return page
}
// TODO: Make it like cursorPaginatedQuery
export const forwardSkipLimitPagination = ({ page }: { page: PaginationInput }) => {
  const { after, first: limit } = page
  const skip = Math.max((typeof after === 'number' ? after : -1) + 1, 0)
  return {
    limit,
    skip,
  }
}
export const forwardSkipLimitPage = <T>({ docs, skip }: { docs: T[]; skip: number }) => {
  const items = docs.map<PageItem<T>>((item, i) => [i + skip, item])

  return makePage({ items, hasNextPage: !!items.length, hasPreviousPage: false })
}

// export const updateRelationCountQuery = ({
//   edgeType,
//   targetNodeType,
//   nodeId,
//   side,
//   amount,
// }: {
//   edgeType: EdgeType
//   nodeId: string
//   targetNodeType: NodeType
//   side: 'from' | 'to' //FIXME: use GQL Type
//   amount: number
// }) => {
//   const [nodeType] = parseCheckedNodeId(nodeId as Id)
//   const q = aq<number | null>(`
//       LET v = Document( ${aqlstr(nodeId)} )
//       LET currRelCount = v._relCount.${edgeType}.${side}.${targetNodeType} || 0
//       LET newRelCount = currRelCount + (${Math.floor(amount)})
//       UPDATE v WITH MERGE_RECURSIVE(v,{
//         _relCount: {
//           ${edgeType} : {
//             ${side}: {
//               ${targetNodeType}: newRelCount
//             }
//           }
//         }
//       })

//       IN ${nodeType}

//       RETURN newRelCount
//   `)
//   return q
// }

// export const mergeNodeMeta = ({ mergeMeta, nodeProp }: { mergeMeta: string; nodeProp: string }) =>
//   `MERGE_RECURSIVE(${nodeProp},{ ${NODE_META_PROP}: ${mergeMeta} })`

// export const updateRelationCountQueries = ({
//   life,
//   edgeType,
//   _from,
//   _to,
// }: {
//   life: 'create' | 'delete'
//   _from: string
//   _to: string
//   edgeType: EdgeType
// }) => {
//   const amount = life === 'create' ? 1 : -1
//   const [fromNodeType] = parseCheckedNodeId(_from as Id)
//   const [toNodeType] = parseCheckedNodeId(_to as Id)

//   const relationOut = updateRelationCountQuery({
//     edgeType,
//     nodeId: _from,
//     side: 'to',
//     amount,
//     targetNodeType: toNodeType,
//   })
//   const relationIn = updateRelationCountQuery({
//     edgeType,
//     nodeId: _to,
//     side: 'from',
//     amount,
//     targetNodeType: fromNodeType,
//   })
//   return { relationIn, relationOut }
// }

// const MARK_DELETED_PROP = '_deleted'
// export const isMarkDeleted = (varname: string) => `HAS(${varname}, "${MARK_DELETED_PROP}")`
// export const markDeletedPatch = ({ byId }: { byId: Id }) => `{ ${MARK_DELETED_PROP}: {
//     by: { _id: ${aqlstr(byId)} },
//     at: DATE_NOW()
//   }
// }`

// const CREATED_PROP = '_created'
// export const createdByAtPatch = ({ byId }: { byId: string }) => `{
//     ${CREATED_PROP}:{
//       by: { _id: ${aqlstr(byId)}, id: ${aqlstr(byId)} },
//       at: DATE_NOW()
//     }
//   }`

// const ORGANIZATION_PROP = '_organization'
// export const createdOrganizationPatch = ({ orgId }: { orgId?: string }) =>
//   orgId
//     ? `{
//       ${ORGANIZATION_PROP}: { _id: ${aqlstr(orgId)}, id: ${aqlstr(orgId)} }
//     }`
//     : `{}`

// export const createNodeMergePatch = ({ byId, doc, orgId }: { doc: object; byId: string; orgId?: string }) => `
//   MERGE( ${aqlstr(doc)}, ${createdOrganizationPatch({ orgId })}, ${createdByAtPatch({ byId })}  )`

// export const createEdgeMergePatch = ({ byId, doc }: { doc: object; byId: string }) => `
//   MERGE( ${aqlstr(doc)}, ${createdByAtPatch({ byId })},  )`

export const documentByNodeIdSlug = ({ _slug, _type }: GraphNodeIdentifierSlug) =>
  documentBySlugType({ slugVar: `${aqlstr(_slug)}`, type: _type })

export const documentBySlugType = ({ slugVar, type }: { type: GraphNodeType; slugVar: string }) => `
  ( ( 
    FOR n in ${type} 
      FILTER n._slug == ${slugVar}
      LIMIT 1
    RETURN n
  ) [0] )
`

export const aqlGraphNode2GraphNode = <T extends GraphNodeType>(aqlGraphNode: AqlGraphNodeByType<T>) => {
  // console.log(`aqlGraphNode2GraphNode ${aqlGraphNode._id}`, aqlGraphNode)
  const [__type, __permId] = aqlGraphNode._id.split('/')
  const graphNode: GraphNodeByType<T> = {
    _type: __type! as T,
    _permId: __permId!,
    ...(aqlGraphNode as any),
  }
  return graphNode
}

export const graphNode2AqlGraphNode = <T extends GraphNodeType>(graphNode: GraphNodeByType<T>) => {
  const _key = graphNode._permId
  const _id = `${graphNode._type}/${graphNode._permId}`
  const aqlGraphNode: AqlGraphNodeByType<T> = {
    _key,
    _id,
    ...(graphNode as any),
  }
  return aqlGraphNode
}

export const aqlGraphEdge2GraphEdge = <T extends GraphEdgeType>(aqlGraphEdge: AqlGraphEdgeByType<T>) => {
  const [__type, id] = aqlGraphEdge._id.split('/')
  const graphEdge: GraphEdgeByType<T> = {
    _type: __type! as T,
    id,
    ...(aqlGraphEdge as any),
  }
  return graphEdge
}
