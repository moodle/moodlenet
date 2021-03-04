import { api } from '../../../../lib/domain'
import { MoodleNetDomain } from '../../../MoodleNetDomain'
import { GlyphCreateCounterHandler } from '../apis/ContentGraph.Counters.GlyphCreate'
import { contentGraphRoutes } from '../ContentGraph.routes'

api<MoodleNetDomain>()('ContentGraph.Counters.GlyphCreate').respond(GlyphCreateCounterHandler)

contentGraphRoutes.bind({
  event: 'ContentGraph.Node.Created',
  route: '*',
  api: 'ContentGraph.Counters.GlyphCreate',
})

contentGraphRoutes.bind({
  event: 'ContentGraph.Edge.Created',
  route: '*',
  api: 'ContentGraph.Counters.GlyphCreate',
})
