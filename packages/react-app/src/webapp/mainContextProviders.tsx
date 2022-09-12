import { ExtId } from '@moodlenet/core'
import { FC, PropsWithChildren } from 'react'
import { PluginMainComponent } from '..'
import * as auth from './main-lib/auth'
import * as header from './ui/components/organisms/Header'
import { ContentGraphProvider } from './ui/components/pages/ContentGraph/ContentGraphProvider'
import * as set from './ui/components/pages/Settings/SettingsContext'

export const pluginMainModules: { MainComponent: PluginMainComponent; extId: ExtId }[] = []

export const ProvideMainContexts: FC<PropsWithChildren<{}>> = ({ children }) => {
  console.log({ pluginMainModules })
  const ctxProviderWrap = Object.values(pluginMainModules)
    .reverse()
    .reduce(
      (_children, { MainComponent, extId }) => <MainComponent key={extId}>{_children}</MainComponent>,
      <>{children}</>,
    )

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
