import { _node } from '@moodlenet/common/lib/assertions/op-chains'
import { NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { Id, IdKey } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { AssertionOf } from '@moodlenet/common/lib/utils/op-chain'
import { Maybe } from '@moodlenet/common/lib/utils/types'
import { ulidKey } from '../../../../lib/helpers/arango'
import { createdByAtPatch, toDocumentEdgeOrNode } from './helpers'
import { DocumentNodeDataByType } from './types'

export const createNodeQ = <Type extends NodeType>({
  data,
  nodeType,
  key,
  // assertions,
  creatorProfileId,
}: {
  key?: IdKey // remove this .. it was only necessary for profile creation on accuont activation, change the flow and disjoint the two
  nodeType: Type
  data: DocumentNodeDataByType<Type>
  creatorProfileId: Id
  assertions: Maybe<AssertionOf<typeof _node>>
}) => {
  key = key ?? ulidKey()
  // const aqlAssertionMaps = getNodeOpAqlAssertions({ ctx, op: 'create', nodeType, nodeVar: null })
  // if (typeof aqlAssertionMaps === 'string') {
  //   return aqlAssertionMaps
  // }

  const newnode = { ...data, _key: key, __typename: nodeType }
  const q = `
    let newnode = ${createdByAtPatch(newnode, creatorProfileId)}

    //FILTER ( $ {aqlAssertionMaps.renderedAqlFilterExpr} )

    INSERT newnode into ${nodeType}

    return ${toDocumentEdgeOrNode('NEW')}
  `
  return q
}
// Assertions failed
//   const assertionFailedQ = `
//     ${aqlAssertionMaps.varAssignment}

//     return ${aqlAssertionMaps.assertionMapVarName}
//   `
//   // console.log({ assertionFailedQ })
//   const assertionCursor = await db.query(assertionFailedQ)
//   const assertionResult = await assertionCursor.next()
//   const assertionMapValues: {
//     [a in Assertion]?: boolean
//   } = assertionResult

//   const assertionFailedQResult = {
//     ...assertionMapValues,
//     CreateNodeAssertionsFailed: 'CreateNodeAssertionsFailed',
//     nodeOpAssertions: aqlAssertionMaps.nodeOpAssertions,
//   } as const

//   // console.log({ assertionFailedQResult })

//   return assertionFailedQResult
// }
