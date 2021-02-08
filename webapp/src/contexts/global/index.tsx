import { FC } from 'react';
import { ApolloClientProvider } from './apollo';
import { LocalizationProvider } from './localization';
import { RouterProvider } from './router';

export const GlobalContexts: FC = ({ children }) => {
  return (
    <LocalizationProvider>
      <ApolloClientProvider>
        <RouterProvider>{children}</RouterProvider>
      </ApolloClientProvider>
    </LocalizationProvider>
  );
};
