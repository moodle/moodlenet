import { Acks } from '../../../../../../lib/domain/misc'
import { MoodleNetDomain } from '../../../../../MoodleNetDomain'

export const glyphCreateCounter: __LookupSubInit<
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
