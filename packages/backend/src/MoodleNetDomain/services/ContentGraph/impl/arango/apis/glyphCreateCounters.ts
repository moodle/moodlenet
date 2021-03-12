import { Acks } from '../../../../../../lib/domain/misc'
import { Subscriber } from '../../../../../../lib/domain/sub'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'

export const GlyphCreateCounterSubscriber: Subscriber<
  MoodleNetArangoContentGraphSubDomain,
  'ContentGraph.Node.Created' | 'ContentGraph.Edge.Created'
> = async event => {
  console.log(`**************************************** GlyphCreateCounterHandler:`, event)
  return Acks.Done
}
