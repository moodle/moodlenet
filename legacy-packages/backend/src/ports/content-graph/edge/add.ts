// create

import { GraphEdge } from '@moodlenet/common/dist/content-graph/types/edge'
import { GraphNode, GraphNodeIdentifier } from '@moodlenet/common/dist/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/dist/types'
import { newGlyphPermId } from '@moodlenet/common/dist/utils/content-graph/slug-id'
import { DistOmit } from '@moodlenet/common/dist/utils/types'
import { ns } from '../../../lib/ns/namespace'
import { plug, value } from '../../../lib/plug'
import { Assertions, BV } from '../graph-lang/base'
import { Rel } from '../graph-lang/match'

export const operators = value<Operators>(ns(module, 'operators'))
export type Operators = {
  fromNode: BV<GraphNode>
  toNode: BV<GraphNode>
}

export const bRules = plug<BRules>(ns(module, 'b-rules'))
export type BRules = (
  _: Input & {
    rel: Rel
    arg: Omit<AdapterArg, 'assertions'>
  },
) => Promise<AdapterArg | null>

export const adapter = plug<Adapter>(ns(module, 'adapter'))
export type Adapter = <E extends GraphEdge = GraphEdge>(_: AdapterArg) => Promise<E | null>
export type AdapterArg<E extends GraphEdge = GraphEdge> = {
  edge: E
  from: GraphNodeIdentifier
  to: GraphNodeIdentifier
  assertions: Assertions
}

export type Data = DistOmit<GraphEdge, '_creator' | '_created' | 'id' | '_edited'>
export type Input = {
  sessionEnv: SessionEnv
  from: GraphNodeIdentifier
  to: GraphNodeIdentifier
  data: Data
}
export type Port = (_: Input) => Promise<GraphEdge | null>
export const port = plug<Port>(ns(module, 'port'), async ({ from, to, sessionEnv, data }) => {
  if (!sessionEnv.authId) {
    return null
  }
  const adapterArg = await bRules({
    from,
    to,
    sessionEnv,
    data,
    arg: {
      edge: {
        ...data,
        id: newGlyphPermId(),
        _creator: sessionEnv.authId,
        _created: sessionEnv.timestamp,
        _edited: sessionEnv.timestamp,
      },
      from,
      to,
    },
    rel: [from._type, data._type, to._type],
  })
  if (!adapterArg) {
    return null
  }

  const result = await adapter(adapterArg)
  if (!result) {
    return null
  }

  return result
})
