import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import { parseNodeIdString } from '@moodlenet/common/lib/utils/content-graph'
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
          const parsedId = parseNodeIdString(args?.id)
          if (parsedId) {
            const { id, nodeType } = parsedId
            return toReference({
              __typename: nodeType,
              id,
            })
          }
          return
        },
      },
    },
  },
})

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

const link = ApolloLink.from([...(isProduction ? [] : [apolloLogger]), authLink, httpLink])

export const apolloClient = new ApolloClient({
  cache,
  link,
  connectToDevTools: !isProduction,
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})
