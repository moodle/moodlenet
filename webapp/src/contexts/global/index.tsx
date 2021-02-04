import { FC } from 'react';
import { ApolloClientProvider } from './apollo';

export const GlobalContexts: FC = ({ children }) => {
  return <ApolloClientProvider>{children}</ApolloClientProvider>;
};
