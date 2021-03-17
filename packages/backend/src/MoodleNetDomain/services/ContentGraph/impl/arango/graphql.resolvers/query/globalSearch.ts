import { call } from '../../../../../../../lib/domain/amqp/call'
import * as GQL from '../../../../ContentGraph.graphql.gen'
import { MoodleNetArangoContentGraphSubDomain } from '../../MoodleNetArangoContentGraphSubDomain'

export const gqlGlobalSearch: GQL.QueryResolvers['globalSearch'] = async (
  _root,
  { text, page, nodeTypes },
  ctx /* ,_info */,
) => {
  const searchPage = await call<MoodleNetArangoContentGraphSubDomain>()('ContentGraph.GlobalSearch', ctx.flow)({
    page,
    text,
    nodeTypes,
  })
  return searchPage
}
