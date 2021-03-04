import { Binder } from '../../../../lib/domain/event/types'
import { MoodleNetDomain } from '../../../MoodleNetDomain'

export const GlyphCreateCounterHandler: Binder<
  MoodleNetDomain,
  'ContentGraph.Node.Created' | 'ContentGraph.Edge.Created'
> = _ => {
  console.log(`**************************************** GlyphCreateCounterHandler:`, _)
}
