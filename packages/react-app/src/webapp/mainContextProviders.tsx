import { FC, PropsWithChildren } from 'react'
import { PkgIds, PluginMainComponent } from '..'
import * as auth from './main-lib/auth'
import { ContentGraphProvider } from './ui/components/pages/ContentGraph/ContentGraphProvider'
import * as set from './ui/components/pages/Settings/SettingsContext'

export const pluginMainModules: { MainComponent: PluginMainComponent; pkg: PkgIds }[] = []

export const ProvideMainContexts: FC<PropsWithChildren<{}>> = ({ children }) => {
  console.log({ pluginMainModules })
  const ctxProviderWrap = Object.values(pluginMainModules)
    .reverse()
    .reduce(
      (_children, { MainComponent, pkg }) => <MainComponent key={pkg.id}>{_children}</MainComponent>,
      <>{children}</>,
    )

  return (
    <auth.Provider>
      <set.Provider>
        <ContentGraphProvider>
          {/* <I18nProvider i18n={i18n}> */}
          {ctxProviderWrap}
          {/* </I18nProvider> */}
        </ContentGraphProvider>
      </set.Provider>
    </auth.Provider>
  )
}
