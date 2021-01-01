import { Resolvers } from '../../../../ContentGraph.graphql.gen'
import { Query } from './Query'
import { Subject } from './Subject'
import { User } from './User'

export const resolvers = Promise.all([User, Subject, Query]).then<Resolvers>(
  ([User, Subject, Query]) => ({
    User,
    Subject,
    Query,
    Follows: {} as any,
    GraphEdge: {} as any,
    GraphVertex: {} as any,
    IUserFollowsSubject: {} as any,
    IUserFollowsUser: {} as any,
    Mutation: {} as any,
    Page: {} as any,
    PageInfo: {} as any,
    SubjectFollower: {} as any,
    SubjectFollowersPage: {} as any,
    UserFollowsSubject: {} as any,
    UserFollowsSubjectPage: {} as any,
    UserFollowsUser: {} as any,
    UserFollowsUserPage: {} as any,
  })
)
