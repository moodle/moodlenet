import { FC } from 'react'
import { ApolloClientProvider } from './Global/Apollo'
import { LocalInstanceProvider } from './Global/LocalInstance'
import { LocalizationProvider } from './Global/Localization'
import { RouterProvider } from './Global/Router'
import { SeoProvider } from './Global/Seo'
import { SessionProvider } from './Global/Session'
import { UICtxProviders } from './Global/UI'

export const GlobalContexts: FC = ({ children }) => {
  return (
    <LocalizationProvider>
      <ApolloClientProvider>
        <SessionProvider>
          <LocalInstanceProvider>
            <RouterProvider>
              <SeoProvider>
                <UICtxProviders>{children}</UICtxProviders>
              </SeoProvider>
            </RouterProvider>
          </LocalInstanceProvider>
        </SessionProvider>
      </ApolloClientProvider>
    </LocalizationProvider>
  )
}
