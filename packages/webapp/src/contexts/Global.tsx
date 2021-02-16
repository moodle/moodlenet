import { FC } from 'react'
import { ApolloClientProvider } from './Global/Apollo'
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
            <UICtxProviders>{children}</UICtxProviders>
          </RouterProvider>
        </SessionProvider>
      </ApolloClientProvider>
    </LocalizationProvider>
  )
}
