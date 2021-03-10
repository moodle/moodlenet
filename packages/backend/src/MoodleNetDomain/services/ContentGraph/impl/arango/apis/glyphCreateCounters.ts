import { Acks } from '../../../../../../lib/domain/misc'
import { SubscriberInitImpl } from '../../../../../../lib/domain/sub'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'

export const glyphCreateCounter: SubscriberInitImpl<
  MoodleNetDomain,
  'ContentGraph.Node.Created' | 'ContentGraph.Edge.Created'
> = () => {
  return [
    async _ => {
      console.log(`**************************************** GlyphCreateCounterHandler:`, _)
      return Acks.Done
    },
  ]
}
