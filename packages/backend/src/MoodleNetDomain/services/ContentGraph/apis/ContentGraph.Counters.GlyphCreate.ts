import { Acks } from '../../../../lib/domain/amqp'
import { Binder } from '../../../../lib/domain/event/types'
import { MoodleNetDomain } from '../../../MoodleNetDomain'

export const GlyphCreateCounterHandler: Binder<
  MoodleNetDomain,
  'ContentGraph.Node.Created' | 'ContentGraph.Edge.Created'
> = async _ => {
  console.log(`**************************************** GlyphCreateCounterHandler:`, _)
  return Acks.Done
}
