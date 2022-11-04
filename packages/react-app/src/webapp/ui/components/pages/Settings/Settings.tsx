import { FC, ReactElement, useState } from 'react'
import MainLayout, { MainLayoutProps } from '../../layout/MainLayout/MainLayout.js'
// import { Link } from '../../../../elements/link'
// import { RegistryEntry } from '../../../../main-lib/registry'
import { Card } from '@moodlenet/component-library'
import './Settings.scss'

export type SettingsItem = { Content: ReactElement; Menu: ReactElement }
export type SettingsProps = {
  mainLayoutProps: MainLayoutProps
  settingsItems: SettingsItem[]
}

export const Settings: FC<SettingsProps> = ({ mainLayoutProps, settingsItems }) => {
  const [currSettingsItem, chooseSettingsItem] = useState(settingsItems[0])

  return (
    <MainLayout {...mainLayoutProps}>
      <div className="settings-page">
        <div className="left-menu">
          <Card>
            {settingsItems.map((settingsEntry, i) => {
              const isCurrent = settingsEntry === currSettingsItem

              const onClick = isCurrent ? undefined : () => chooseSettingsItem(settingsEntry)
              // console.log('key: ', settingsEntry.Content.key)

              return (
                <div
                  key={i}
                  // key={settingsEntry.Content.key ? settingsEntry.Content.key : ''}
                  className={`section ${settingsEntry === currSettingsItem ? 'selected' : ''}`}
                  onClick={onClick}
                >
                  {settingsEntry.Menu}
                </div>
              )
            })}
          </Card>
        </div>
        <div className="content">
          {currSettingsItem ? currSettingsItem.Content : null}
          {/* {ctxElement} */}
        </div>
      </div>
    </MainLayout>
  )
}

Settings.displayName = 'SettingsPage'
