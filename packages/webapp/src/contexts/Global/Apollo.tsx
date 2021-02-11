import { ApolloProvider } from '@apollo/client'
import { FC } from 'react'
import { apolloClient } from './Apollo/client'

export let ApolloClientProvider: FC = ({ children }) => {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
}
