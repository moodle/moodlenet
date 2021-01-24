import { ServiceExecutableSchemaDefinition } from '../../MoodleNetGraphQL'
import { getContentGraphPersistence } from './ContentGraph.env'
import { Resolvers } from './ContentGraph.graphql.gen'

export const getContentGraphServiceExecutableSchemaDefinition = async (): Promise<ServiceExecutableSchemaDefinition> => {
  const {
    /* findNode, */ graphQLTypeResolvers,
  } = await getContentGraphPersistence()

  const resolvers: Resolvers = {
    ...graphQLTypeResolvers,
    // Query: {
    //   async node(_root, { _id, nodeType }, ctx /* ,_info */) {
    //     const {
    //       access: { read: allow },
    //     } = nodeConstraints[nodeType]
    //     const firstStageAccessCheck = accessRead.firstStageCheckPublicAccess({
    //       allow,
    //       ctx,
    //     })
    //     if (!firstStageAccessCheck) {
    //       return accessRead.nodeQueryErrorNotAuthorized(null)
    //     }

    //     const shallowNode = await findNode({ _id, nodeType })
    //     if (!shallowNode) {
    //       return accessRead.nodeQueryErrorNotFound(null)
    //     }

    //     const secondStageAccessCheck = accessRead.secondStageCheckAccessByDocMeta(
    //       {
    //         allow,
    //         ctx,
    //         meta: shallowNode._meta,
    //       }
    //     )

    //     if (!secondStageAccessCheck) {
    //       return accessRead.nodeQueryErrorNotAuthorized(null)
    //     }

    //     const queryNodeSuccess: QueryNodeSuccess = {
    //       result: shallowNode as Node,
    //       __typename: 'QueryNodeSuccess',
    //     }
    //     return queryNodeSuccess
    //   },
    // },
    Mutation: {} as any,
    ...({} as any),
  }

  return { resolvers }
}
