import { _node } from '@moodlenet/common/lib/assertions/op-chains'
import { Maybe, NodeType } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { IdKey } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
//import { IdKey, Maybe, } from '@moodlenet/common/lib/utils/content-graph'
import { AssertionOf } from '@moodlenet/common/lib/utils/op-chain'
import { aqlstr } from '../../../../lib/helpers/arango'
// import { getNodeOpAqlAssertions } from './assertions/node'
import { isMarkDeleted, toDocumentEdgeOrNode } from './helpers'

export const getNode = <Type extends NodeType = NodeType>({
  nodeType,
  _key,
}: //assertions
{
  assertions: Maybe<AssertionOf<typeof _node>>
  _key: IdKey
  nodeType: Type
}) => {
  // const aqlAssertionMaps = getNodeOpAqlAssertions({ ctx, op: 'read', nodeType, nodeVar: 'node' })
  // if (typeof aqlAssertionMaps === 'string') {
  //   // return null
  //   console.log(aqlAssertionMaps)
  // }

  const q = `
    let node = Document(${aqlstr(`${nodeType}/${_key}`)})

    FILTER !${isMarkDeleted('node')}
     // AND ( $ {aqlAssertionMaps.renderedAqlFilterExpr} )

    return ${toDocumentEdgeOrNode('node')}
  `
  // console.log(q)
  return q
}
