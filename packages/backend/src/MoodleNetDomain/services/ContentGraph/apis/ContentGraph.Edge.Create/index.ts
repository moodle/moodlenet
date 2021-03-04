import { Id, IdKey } from '@moodlenet/common/lib/utils/content-graph'
import { event } from '../../../../../lib/domain'
import { mergeFlow } from '../../../../../lib/domain/helpers'
import { MoodleNetDomain } from '../../../../MoodleNetDomain'
import { MoodleNetExecutionContext } from '../../../../types'
import { CreateEdgeInput, /* CreateEdgeMutationErrorType, */ EdgeType } from '../../ContentGraph.graphql.gen'
import { CreateEdgeShallowPayload } from '../../persistence/types'
import { getCreateHook } from './hooks'
// import { CreateEdgeInput, CreateEdgeMutationErrorType, EdgeType } from '../../ContentGraph.graphql.gen'
// import { createEdgeMutationError } from '../../graphql.resolvers/helpers'
// import { createHooks, isAllowedCreationType } from './hooks'

export type CreateEdgeReq<Type extends EdgeType> = {
  edgeType: Type
  input: Exclude<CreateEdgeInput[Type], null | undefined>
  ctx: MoodleNetExecutionContext
  key?: IdKey
  from: Id
  to: Id
}

export const CreateEdgeHandler = async <Type extends EdgeType>({
  ctx,
  input,
  edgeType,
  from,
  to,
  key,
}: CreateEdgeReq<Type>): Promise<CreateEdgeShallowPayload<Type>> => {
  // if (!isAllowedCreationType(edgeType)) {
  //   return createEdgeMutationError(CreateEdgeMutationErrorType.NotAuthorized, 'not Allowed Creation Type')
  // }
  // if (!(ctx.type === 'anon')) {
  //   return {
  //     __typename: 'CreateEdgeMutationError',
  //     details: `anonymous can't create relations`,
  //     type: CreateEdgeMutationErrorType.NotAuthorized,
  //   }
  // }
  const hook = getCreateHook<typeof edgeType>(edgeType)
  const createEdgeResult = await hook({ input, ctx, from, to, key })
  if (createEdgeResult.__typename !== 'CreateEdgeMutationError') {
    event<MoodleNetDomain>(mergeFlow(ctx.flow, [edgeType]))('ContentGraph.Edge.Created').emit({
      payload: { edge: createEdgeResult },
    })
  }
  // let x: CreateEdgeShallowPayload<EdgeType>={}as any
  // const z=x.__typename!=='CreateEdgeMutationError'?x.__typename==='Follows'?x.__typename==='':null:x.type
  return createEdgeResult
}
