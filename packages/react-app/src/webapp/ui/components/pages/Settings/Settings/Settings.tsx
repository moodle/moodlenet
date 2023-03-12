import { FC, useState } from 'react'
import MainLayout, { MainLayoutProps } from '../../../layout/MainLayout/MainLayout.js'
// import { Link } from '../../../../elements/link'
// import { RegistryEntry } from '../../../../main-lib/registry'
import { AddonItem, Card } from '@moodlenet/component-library'
import './Settings.scss'

export type SettingsItem = { Content: AddonItem; Menu: AddonItem }
export type SettingsProps = {
  mainLayoutProps: MainLayoutProps
  settingsItems: SettingsItem[]
}

export const Settings: FC<SettingsProps> = ({ mainLayoutProps, settingsItems }) => {
  const [currSettingsItem, chooseSettingsItem] = useState(settingsItems[0])

  return (
    <MainLayout
      {...mainLayoutProps}
      streched={true}
      headerProps={{
        ...mainLayoutProps.headerProps,
      }}
    >
      <div className={`settings`}>
        {
          <div className="left-menu" role="navigation">
            <Card role="navigation">
              {settingsItems.map(settingsEntry => {
                const isCurrent = JSON.stringify(settingsEntry) === JSON.stringify(currSettingsItem)
                const onClick = isCurrent ? undefined : () => chooseSettingsItem(settingsEntry)

                return (
                  <div
                    key={settingsEntry.Menu.key}
                    className={`section ${isCurrent ? 'selected' : ''}`}
                    onClick={onClick}
                  >
                    <div className={`border-container ${isCurrent ? 'selected' : ''}`}>
                      <div className={`border ${isCurrent ? 'selected' : ''}`} />
                    </div>
                    <div className={`content ${isCurrent ? 'selected' : ''}`}>
                      {<settingsEntry.Menu.Item />}
                    </div>
                  </div>
                )
              })}
            </Card>
          </div>
        }
        {currSettingsItem && (
          <div className="content" key={currSettingsItem.Content.key}>
            {currSettingsItem ? <currSettingsItem.Content.Item /> : <></>}
            {/* {ctxElement} */}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

Settings.displayName = 'SettingsPage'
