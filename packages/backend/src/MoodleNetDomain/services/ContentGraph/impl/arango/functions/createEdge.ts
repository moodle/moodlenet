import { getEdgeDefForNodes, getEdgeOpAssertions } from '@moodlenet/common/lib/content-graph'
import { contentGraphDef } from '@moodlenet/common/lib/content-graph/def'
import { Assertion } from '@moodlenet/common/lib/content-graph/types'
import { EdgeType, NodeType } from '@moodlenet/common/lib/pub-graphql/types.graphql.gen'
import { Id, IdKey, nodeTypeFromId } from '@moodlenet/common/lib/utils/content-graph'
import BoolExpr from 'boolean-expressions'
import { aqlstr, ulidKey } from '../../../../../../lib/helpers/arango'
import { getSessionExecutionContext, MoodleNetExecutionContext } from '../../../../../types'
import { CreateEdgeData, ShallowEdgeByType, ShallowEdgeMeta } from '../../../types.node'
import { Persistence } from '../types'

export const createEdge = async <Type extends EdgeType>({
  persistence: { db },
  data,
  edgeType,
  from,
  to,
  key,
  ctx,
}: {
  persistence: Persistence
  ctx: MoodleNetExecutionContext
  edgeType: Type
  key?: IdKey // remove this .. it was only necessary for profile creation on accuont activation, change the flow and disjoint the two
  data: CreateEdgeData<Type>
  from: Id
  to: Id
}) => {
  key = key ?? ulidKey()

  // const { auth } = ctx
  const fromType = nodeTypeFromId(from)
  const toType = nodeTypeFromId(to)

  const edgeDef = getEdgeDefForNodes({
    graph: contentGraphDef,
    edge: edgeType,
    from: fromType,
    to: toType,
  })
  if (!edgeDef) {
    return null
  }
  const assertions = getAssertions({ ctx, edgeType, fromType, toType })
  if (!assertions) {
    return null
  }

  const _meta: ShallowEdgeMeta = { created: new Date(), updated: new Date() }
  const newedge = {
    ...data,
    __typename: edgeType,
    _fromType: fromType,
    _toType: toType,
    _meta,
    //
    _from: from,
    _to: to,
    _key: key,
  }

  const q = `
    let from = DOCUMENT(${aqlstr(from)})
    let to = DOCUMENT(${aqlstr(to)})

    FILTER !!from AND !!to AND (${assertions.insertFilter})

    INSERT ${aqlstr(newedge)} into ${edgeType}

    return NEW
  `
  console.log(q)
  const cursor = await db.query(q)
  const result = await cursor.next()
  return result as ShallowEdgeByType<Type>
}

type AssertionMap = {
  [a in Assertion]: (_: {
    ctx: MoodleNetExecutionContext
    edgeType: EdgeType
    nodeVar: string
    edgeVar: string
  }) => { insertFilter: string }
}

const assertionMap: AssertionMap = {
  ConnNoExistingSameEdgeBetweenTheTwoNodesInSameDirection: ({ edgeType, edgeVar }) => {
    return {
      insertFilter: `LENGTH(
      FOR ${edgeVar}  IN ${edgeType}  
        FILTER ${edgeVar}._from == from._id and ${edgeVar}._to == to._id
        limit 1
        return ${edgeVar} 
      ) < 1`,
    }
  },
  ConnNoExistingSameEdgeTypeToNode: ({ edgeType, edgeVar }) => {
    return {
      insertFilter: `LENGTH(
      FOR ${edgeVar} IN ${edgeType}  
        FILTER ${edgeVar}._to == to._id
        limit 1
        return ${edgeVar}
      ) < 1`,
    }
  },
  NodeExecutorCreatedThisNode: ({ ctx, nodeVar }) => {
    const sessionCtx = getSessionExecutionContext(ctx)
    if (!sessionCtx) {
      return { insertFilter: 'false' }
    }
    return {
      insertFilter: `${nodeVar}._meta.creator._id == ${aqlstr(sessionCtx.profileId)}`,
    }
  },
  NodeThisNodeIsExecutorProfile: ({ ctx, nodeVar }) => {
    const sessionCtx = getSessionExecutionContext(ctx)
    if (!sessionCtx) {
      return { insertFilter: 'false' }
    }
    return {
      insertFilter: `${nodeVar}._id == ${aqlstr(sessionCtx.profileId)}`,
    }
  },
}

export const getAssertions = ({
  edgeType,
  fromType,
  toType,
  ctx,
}: {
  edgeType: EdgeType
  fromType: NodeType
  toType: NodeType
  ctx: MoodleNetExecutionContext
}) => {
  const edgeOpAssertions = getEdgeOpAssertions({
    graph: contentGraphDef,
    edge: edgeType,
    from: fromType,
    to: toType,
    op: 'create',
  })
  if (!edgeOpAssertions) {
    return false
  }
  const { conn, from, to } = edgeOpAssertions
  const assertions = [conn, from, to]
    .map((expr, assertions_index) => {
      const nodeVar = (['', 'from', 'to'] as const)[assertions_index]
      if (typeof expr === 'boolean') {
        return {
          insertFilter: `/*${nodeVar}*/(${expr})`,
        }
      }
      const boolExpr = new BoolExpr(expr)
      const exprVarNames = boolExpr.getVariableNames() as Assertion[]
      return exprVarNames.reduce(
        (patches, exprVarName) => {
          const assertion = assertionMap[exprVarName]({ ctx, edgeType, nodeVar, edgeVar: 'e' })
          return {
            ...patches,
            insertFilter: patches.insertFilter.replace(
              new RegExp(`${exprVarName}`, 'g'),
              `

              /*${nodeVar}-${exprVarName}*/(${assertion.insertFilter}) 
             
              `,
            ),
          }
        },
        { insertFilter: `(${expr})` },
      )
    })
    .reduce(
      (merged, _) => ({
        ...merged,
        insertFilter: ` ${merged.insertFilter ? `${merged.insertFilter} AND` : ''}  ${_.insertFilter}`,
      }),
      { insertFilter: '' },
    )

  return assertions
}
