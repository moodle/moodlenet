import { GraphNode } from '@moodlenet/common/dist/content-graph/types/node'
import { SessionEnv } from '@moodlenet/common/dist/types'
import { newGlyphIdentifiers, newGlyphPermId } from '@moodlenet/common/dist/utils/content-graph/slug-id'
import { DistOmit } from '@moodlenet/common/dist/utils/types'
import { ns } from '../../../lib/ns/namespace'
import { plug, value } from '../../../lib/plug'
import { adapter as addEdgeAdapter } from '../edge/add'
import { Assertions } from '../graph-lang/base'

export type Operators = unknown
export const operators = value<Operators>(ns(module, 'operators'))

export const bRules = plug<BRules>(ns(module, 'b-rules'))
export type BRules = (
  _: Omit<Input, 'data'> & {
    arg: Omit<AdapterArg, 'assertions'>
  },
) => Promise<AdapterArg | null>

export const adapter = plug<Adapter>(ns(module, 'adapter'))
export type AdapterArg<N extends GraphNode = GraphNode> = { node: N; assertions: Assertions }
export type Adapter = <N extends GraphNode = GraphNode>(_: { node: N; assertions: Assertions }) => Promise<N | null>

export type Data<N extends GraphNode = GraphNode> = DistOmit<
  N,
  '_created' | '_edited' | '_permId' | '_slug' | '_creator'
>
export type Input = {
  data: Data
  sessionEnv: SessionEnv
}
export type Port = (_: Input) => Promise<GraphNode | null>
export const port = plug<Port>(ns(module, 'port'), async ({ data, sessionEnv }) => {
  if (!sessionEnv.authId) {
    return null
  }
  // /^[\p{L}\p{M}\p{N}\p{Zs}]+$/u.test(data.name))

  const adapterArg = await bRules({
    sessionEnv,
    arg: {
      node: {
        ...newGlyphIdentifiers({ name: data.name }),
        ...data,
        _created: sessionEnv.timestamp,
        _edited: sessionEnv.timestamp,
        _creator: sessionEnv.authId,
      },
    },
  })
  if (!adapterArg) {
    return null
  }

  const result = await adapter(adapterArg)
  if (!result) {
    return null
  }
  if (result._creator) {
    await addEdgeAdapter({
      assertions: {},
      edge: {
        _type: 'Created',
        _creator: sessionEnv.authId,
        _created: sessionEnv.timestamp,
        _edited: sessionEnv.timestamp,
        id: newGlyphPermId(),
      },
      from: result._creator,
      to: result,
    })
  }

  return result
})
