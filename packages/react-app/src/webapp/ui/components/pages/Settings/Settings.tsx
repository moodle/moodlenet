import { ComponentType, FC, useState } from 'react'
import MainLayout from '../../layout/MainLayout/MainLayout.js'
// import { Link } from '../../../../elements/link'
// import { RegistryEntry } from '../../../../main-lib/registry'
import { Card } from '@moodlenet/component-library'
import './Settings.scss'

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
