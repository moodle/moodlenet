import { ComponentType, FC, useContext, useMemo, useState } from 'react'
import { Card } from '../../atoms/Card/Card.js'
import MainLayout from '../../layout/MainLayout/MainLayout.js'
// import { Link } from '../../../../elements/link'
// import { RegistryEntry } from '../../../../main-lib/registry'
import { MainContext } from '../../../../MainContext.js'
import { registries } from '../../../../web-lib.mjs'
import { RegistryEntry } from '../../../../web-lib/registry.js'
import Appearance from './Appearance.js'
import { GeneralContent } from './General.js'
import './Settings.scss'
import { SettingsSectionItem } from './SettingsContext.js'

export type SettingsItem = { Panel: ComponentType; Menu: ComponentType; key: string }
export type SettingsProps = {
  settingsItems: SettingsItem[]
}

export const Settings: FC<SettingsProps> = ({ settingsItems }) => {
  const [currSettingsItem, chooseSettingsItem] = useState(settingsItems[0])

  return (
    <MainLayout>
      <div className="settings-page">
        <div className="left-menu">
          <Card>
            {settingsItems.map(settingsEntry => {
              const isCurrent = settingsEntry === currSettingsItem

              const onClick = isCurrent ? undefined : () => chooseSettingsItem(settingsEntry)

              return (
                <div
                  key={settingsEntry.key}
                  className={`section ${settingsEntry === currSettingsItem ? 'selected' : ''}`}
                  onClick={onClick}
                >
                  <settingsEntry.Menu />
                </div>
              )
            })}
          </Card>
        </div>
        <div className="content">
          {currSettingsItem ? <currSettingsItem.Panel /> : null}
          {/* {ctxElement} */}
        </div>
      </div>
    </MainLayout>
  )
}

Settings.displayName = 'SettingsPage'
