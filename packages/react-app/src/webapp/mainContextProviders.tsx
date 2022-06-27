import lib from 'moodlenet-react-app-lib'
import { FC, PropsWithChildren } from 'react'
import ctxProviders from './extContextProvidersModules'

export const ProvideMainContexts: FC<PropsWithChildren> = ({ children }) => {
  const ctxProviderWrap = Object.values(ctxProviders).reduce(
    (_children, { Provider, extId }) => <Provider key={extId}>{_children}</Provider>,
    <>{children}</>,
  )

  return (
    <lib.TestCtx.Provider value={{ _: 'provided test value' }}>
      {/* <I18nProvider i18n={i18n}> */}
      {ctxProviderWrap}
      {/* </I18nProvider> */}
    </lib.TestCtx.Provider>
  )
}
