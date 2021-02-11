import { FC } from 'react'
import { ApolloClientProvider } from './Global/Apollo'
import { LocalizationProvider } from './Global/Localization'
import { RouterProvider } from './Global/Router'
import { UICtxProviders } from './Global/UI'

export const GlobalContexts: FC = ({ children }) => {
  return (
    <LocalizationProvider>
      <ApolloClientProvider>
        <RouterProvider>
          <UICtxProviders>{children}</UICtxProviders>
        </RouterProvider>
      </ApolloClientProvider>
    </LocalizationProvider>
  )
}
