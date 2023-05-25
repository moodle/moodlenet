import type { ComponentType, FC } from 'react'
import { useState } from 'react'
// import { Link } from '../../../../elements/link'
// import { RegistryEntry } from '../../../../main-lib/registry'
import { Card } from '@moodlenet/component-library'
// import '@moodlenet/component-library/ui/scss/application'
import type { MainLayoutProps } from '@moodlenet/react-app/ui'
import { MainLayout } from '@moodlenet/react-app/ui'
import './UserSettings.scss'

export type UserSettingsItem = { key: string; Content: ComponentType; Menu: ComponentType }
export type UserSettingsProps = {
  mainLayoutProps: MainLayoutProps
  settingsItems: UserSettingsItem[]
}

export const UserSettings: FC<UserSettingsProps> = ({ mainLayoutProps, settingsItems }) => {
  const [currSettingsItem, chooseSettingsItem] = useState(settingsItems[0])

  return (
    <MainLayout
      {...mainLayoutProps}
      streched={true}
      headerProps={{
        ...mainLayoutProps.headerProps,
      }}
    >
      <div className={`user-settings`}>
        {
          <div className="menu-container" role="navigation">
            <Card role="navigation" className="menu">
              {settingsItems.map(settingsItem => {
                const isCurrent = JSON.stringify(settingsItem) === JSON.stringify(currSettingsItem)
                const onClick = isCurrent ? undefined : () => chooseSettingsItem(settingsItem)

                return (
                  <div
                    key={settingsItem.key}
                    className={`section ${isCurrent ? 'selected' : ''}`}
                    onClick={onClick}
                  >
                    <div className={`border-container ${isCurrent ? 'selected' : ''}`}>
                      <div className={`border ${isCurrent ? 'selected' : ''}`} />
                    </div>
                    <div className={`content ${isCurrent ? 'selected' : ''}`}>
                      {<settingsItem.Menu />}
                    </div>
                  </div>
                )
              })}
            </Card>
          </div>
        }
        {currSettingsItem && (
          <div className="content" key={currSettingsItem.key}>
            {currSettingsItem ? <currSettingsItem.Content /> : <></>}
            {/* {ctxElement} */}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

UserSettings.displayName = 'UserSettingsPage'
