import { FC, PropsWithChildren } from 'react'
import { TestCtx } from '../react-app-lib/testLib'
import extCtxProviders from './extContextProvidersModules'
import * as header from './ui/components/organisms/Header'

export const ProvideMainContexts: FC<PropsWithChildren<{}>> = ({ children }) => {
  const ctxProviderWrap = Object.values(extCtxProviders).reduce(
    (_children, { Provider, extId }) => <Provider key={extId}>{_children}</Provider>,
    <>{children}</>,
  )

  return (
    <header.Provider>
      <TestCtx.Provider value={{ _: 'provided test value' }}>
        {/* <I18nProvider i18n={i18n}> */}
        {ctxProviderWrap}
        {/* </I18nProvider> */}
      </TestCtx.Provider>
    </header.Provider>
  )
}
