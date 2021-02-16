import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from 'apollo-link-context'
import apolloLogger from 'apollo-link-logger'
import { GRAPHQL_ENDPOINT, isProduction } from '../../../constants'

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
  cache: new InMemoryCache({}),
  link,
  connectToDevTools: !isProduction,
})
