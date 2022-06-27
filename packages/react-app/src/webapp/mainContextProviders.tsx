import { FC, PropsWithChildren } from 'react'
import { StateProvider } from '../react-app-lib/devModeContextProvider'
import { TestCtx } from '../react-app-lib/testLib'
import ctxProviders from './extContextProvidersModules'

export const ProvideMainContexts: FC<PropsWithChildren> = ({ children }) => {
  const ctxProviderWrap = Object.values(ctxProviders).reduce(
    (_children, { Provider, extId }) => <Provider key={extId}>{_children}</Provider>,
    <>{children}</>,
  )

  return (
    <StateProvider>
      <TestCtx.Provider value={{ _: 'provided test value' }}>
        {/* <I18nProvider i18n={i18n}> */}
        {ctxProviderWrap}
        {/* </I18nProvider> */}
      </TestCtx.Provider>
    </StateProvider>
  )
}
