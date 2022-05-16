import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { gqlNodeId2GraphNodeIdentifier } from '@moodlenet/common/dist/utils/content-graph/id-key-type-guards'
import { setContext } from 'apollo-link-context'
import apolloLogger from 'apollo-link-logger'
import { GRAPHQL_ENDPOINT, isProduction } from '../../../constants'
import possibleTypesResultData from '../../../graphql/pub.graphql.link'

const cache = new InMemoryCache({
  possibleTypes: possibleTypesResultData.possibleTypes,
  typePolicies: {
    Query: {
      fields: {
        node(_, { args, toReference }) {
          const id = args?.id ?? ''
          const parsedId = gqlNodeId2GraphNodeIdentifier(id)
          if (parsedId) {
            const { _type } = parsedId
            return toReference({
              __typename: _type,
              id,
            })
          }
          return
        },
      },
    },
  },
})
// window.cache = cache.data.data
let authToken: string | null = null

export const setToken = (token: string | null) => (authToken = token)

const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT })
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      bearer: authToken,
    },
  }
})

const link = ApolloLink.from([
  ...(isProduction ? [] : [apolloLogger]),
  authLink,
  httpLink,
])

export const apolloClient = new ApolloClient({
  cache,
  link,
  connectToDevTools: !isProduction,
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only',
    },
    mutate: {
      fetchPolicy: 'network-only',
    },
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})
