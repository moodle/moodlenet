import { FC, PropsWithChildren } from 'react'
import * as auth from './main-lib/auth'
import * as header from './ui/components/organisms/Header'
import { ContentGraphProvider } from './ui/components/pages/ContentGraph/ContentGraphProvider'
import * as set from './ui/components/pages/Settings/SettingsContext'

const extCtxProviders: any[] = []

export const ProvideMainContexts: FC<PropsWithChildren<{}>> = ({ children }) => {
  const ctxProviderWrap = Object.values(extCtxProviders)
    .reverse()
    .reduce((_children, { Provider, extId }) => <Provider key={extId}>{_children}</Provider>, <>{children}</>)

  return (
    <header.Provider>
      <auth.Provider>
        <set.Provider>
          <ContentGraphProvider>
            {/* <I18nProvider i18n={i18n}> */}
            {ctxProviderWrap}
            {/* </I18nProvider> */}
          </ContentGraphProvider>
        </set.Provider>
      </auth.Provider>
    </header.Provider>
  )
}
