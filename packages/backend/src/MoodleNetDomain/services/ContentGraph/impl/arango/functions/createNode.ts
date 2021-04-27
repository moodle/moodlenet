import { Assertion } from '@moodlenet/common/lib/content-graph'
import { IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { ulidKey } from '../../../../../../lib/helpers/arango'
import { getSessionContext } from '../../../../../MoodleNetGraphQL'
import { MoodleNetAuthenticatedExecutionContext } from '../../../../../types'
import * as GQL from '../../../ContentGraph.graphql.gen'
import { Persistence } from '../types'
import { getNodeOpAqlAssertions } from './assertions/node'
import { createdByAtPatch, toDocumentEdgeOrNode } from './helpers'
import { DocumentNodeByType, DocumentNodeDataByType } from './types'

export const createNode = async <Type extends GQL.NodeType>({
  persistence: { db },
  data,
  nodeType,
  key,
  ctx,
}: {
  persistence: Persistence
  key?: IdKey // remove this .. it was only necessary for profile creation on accuont activation, change the flow and disjoint the two
  nodeType: Type
  data: DocumentNodeDataByType<Type>
  ctx: MoodleNetAuthenticatedExecutionContext
}) => {
  key = key ?? ulidKey()
  const { profileId } = getSessionContext(ctx)
  const aqlAssertionMaps = getNodeOpAqlAssertions({ ctx, op: 'create', nodeType, nodeVar: null })
  if (typeof aqlAssertionMaps === 'string') {
    return aqlAssertionMaps
  }

  const newnode = { ...data, _key: key, __typename: nodeType }
  const q = `
    let newnode = ${createdByAtPatch(newnode, profileId)}

    FILTER ( ${aqlAssertionMaps.renderedAqlFilterExpr} )

    INSERT newnode into ${nodeType}

    return ${toDocumentEdgeOrNode('NEW')}
  `
  console.log(q)
  const cursor = await db.query(q)
  const result = (await cursor.next()) as DocumentNodeByType<Type> | null
  if (result) {
    return result
  }

  // Assertions failed
  const assertionFailedQ = `
    ${aqlAssertionMaps.varAssignment} 

    return ${aqlAssertionMaps.assertionMapVarName}
  `
  // console.log({ assertionFailedQ })
  const assertionCursor = await db.query(assertionFailedQ)
  const assertionResult = await assertionCursor.next()
  const assertionMapValues: {
    [a in Assertion]?: boolean
  } = assertionResult

  const assertionFailedQResult = {
    ...assertionMapValues,
    CreateNodeAssertionsFailed: 'CreateNodeAssertionsFailed',
    nodeOpAssertions: aqlAssertionMaps.nodeOpAssertions,
  } as const

  // console.log({ assertionFailedQResult })

  return assertionFailedQResult
}
