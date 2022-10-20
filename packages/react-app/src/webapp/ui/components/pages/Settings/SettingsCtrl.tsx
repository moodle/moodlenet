import { FC, useContext, useMemo } from 'react'
// import { Link } from '../../../../elements/link'
// import { RegistryEntry } from '../../../../main-lib/registry'
import { MainContext } from '../../../../MainContext.js'
import { registries } from '../../../../web-lib.mjs'
import { RegistryEntry } from '../../../../web-lib/registry.js'
import Appearance from './Appearance.js'
import { GeneralContent } from './General.js'
import { Settings, SettingsItem, SettingsProps } from './Settings.js'
import './Settings.scss'
import { SettingsSectionItem } from './SettingsContext.js'

export const SettingsCtrl: FC = () => {
  const settingsProps = useSettingsProps()
  return <Settings {...settingsProps} />
}

export const useSettingsProps = (): SettingsProps => {
  const { pkgId } = useContext(MainContext)
  const { registry: sectionsReg } = registries.settingsSections.useRegistry()
  const settingsItems = useMemo(() => {
    const baseSettingsItems: RegistryEntry<SettingsSectionItem>[] = [
      { pkgId, item: { Menu: () => <span>General</span>, Content: GeneralContent } },
      { pkgId, item: { Menu: () => <span>Appearance</span>, Content: Appearance } },
      // { def: { Menu: () => <span>Extensions</span>, Content: () => <Navigate to={'/extensions'} /> } },
    ]
    return baseSettingsItems
      .concat(sectionsReg.entries)
      .map<SettingsItem>(({ item: { Content, Menu }, pkgId }) => ({
        key: pkgId.name,
        Menu,
        Panel: Content,
      }))
  }, [pkgId, sectionsReg.entries])
  const settingsProps = useMemo<SettingsProps>(
    () => ({
      settingsItems,
    }),
    [settingsItems],
  )
  return settingsProps
}
