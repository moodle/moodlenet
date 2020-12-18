import { Resolvers } from '../../content-graph.graphql.gen'

export const Types: Resolvers = {
  User: {
    followers: (/* user, args, ctx,info */) => [],
    followsSubjects: () => [],
    followsUsers: () => [],
  },
  Subject: {
    followers: () => [],
  },
}
