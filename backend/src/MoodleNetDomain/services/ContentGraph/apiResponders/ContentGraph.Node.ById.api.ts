import { MoodleNet } from '../../..'
import { NodeByIdApiHandler } from '../apis/ContentGraph.Node.ById'

NodeByIdApiHandler().then((handler) => {
  MoodleNet.respondApi({
    api: 'ContentGraph.Node.ById',
    handler,
  })
})
