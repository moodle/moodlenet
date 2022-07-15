import extCtxProviders from 'ext-context-providers-modules'
import { FC, PropsWithChildren } from 'react'
import * as auth from '../react-app-lib/auth'
import * as header from './ui/components/organisms/Header'

export const ProvideMainContexts: FC<PropsWithChildren<{}>> = ({ children }) => {
  const ctxProviderWrap = Object.values(extCtxProviders).reduce(
    (_children, { Provider, extId }) => <Provider key={extId}>{_children}</Provider>,
    <>{children}</>,
  )

  return (
    <header.Provider>
      <auth.Provider>
        {/* <I18nProvider i18n={i18n}> */}
        {ctxProviderWrap}
        {/* </I18nProvider> */}
      </auth.Provider>
    </header.Provider>
  )
}
