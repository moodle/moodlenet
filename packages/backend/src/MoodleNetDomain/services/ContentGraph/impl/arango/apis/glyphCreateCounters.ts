import { Acks } from '../../../../../../lib/domain/misc'
import { Subscriber } from '../../../../../../lib/domain/sub'
import { MoodleNetArangoContentGraphSubDomain } from '../MoodleNetArangoContentGraphSubDomain'

export const GlyphCreateCounterSubscriber: Subscriber<
  MoodleNetArangoContentGraphSubDomain,
  'ContentGraph.Edge.Created'
> = async (event, flow) => {
  console.log(`**************************************** GlyphCreateCounterHandler:`, event, flow)
  return Acks.Done
}
