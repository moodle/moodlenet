import { GraphQLError } from 'graphql'
import { MoodleNet } from '../../../../..'
import { contentGraphRoutes } from '../../../Content-Graph.routes'
import { QueryResolvers } from '../../content-graph.graphql.gen'

export const subject: QueryResolvers['subject'] = (_root, args /* , ctx, info */) => {
  return MoodleNet.callApi({
    api: 'ContentGraph.subject.get',
    flow: contentGraphRoutes.flow('query'),
    req: { id: args.id },
  }).then(({ res }) => {
    if (res.___ERROR) {
      throw new GraphQLError(res.___ERROR.msg)
    }
    return res.subject
  })
}
