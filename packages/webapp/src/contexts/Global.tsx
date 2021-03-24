import { FC } from 'react'
import { ApolloClientProvider } from './Global/Apollo'
import { GlobalSearchProvider } from './Global/GlobalSearch'
import { LocalizationProvider } from './Global/Localization'
import { RouterProvider } from './Global/Router'
import { SessionProvider } from './Global/Session'
import { UICtxProviders } from './Global/UI'

export const GlobalContexts: FC = ({ children }) => {
  return (
    <LocalizationProvider>
      <ApolloClientProvider>
        <SessionProvider>
          <RouterProvider>
            <GlobalSearchProvider>
              <UICtxProviders>{children}</UICtxProviders>
            </GlobalSearchProvider>
          </RouterProvider>
        </SessionProvider>
      </ApolloClientProvider>
    </LocalizationProvider>
  )
}
