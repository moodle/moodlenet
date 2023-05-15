import type { FC, PropsWithChildren } from 'react'
import * as Organization from './context/OrganizationCtx.js'
import * as set from './context/SettingsContext.js'

const MainComponent: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Organization.Provider>
      <set.SettingsProvider>
        {/* <I18nProvider i18n={i18n}> */}
        {children}
        {/* </I18nProvider> */}
      </set.SettingsProvider>
    </Organization.Provider>
  )
}
export default MainComponent
