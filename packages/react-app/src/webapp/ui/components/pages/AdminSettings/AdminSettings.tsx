import type { ComponentType, FC } from 'react'
import { useState } from 'react'
import type { MainLayoutProps } from '../../layout/MainLayout/MainLayout.js'
import MainLayout from '../../layout/MainLayout/MainLayout.js'
// import { Link } from '../../../../elements/link'
// import { RegistryEntry } from '../../../../main-lib/registry'
import { Card } from '@moodlenet/component-library'
import './AdminSettings.scss'

export type AdminSettingsItem = { key: string; Content: ComponentType; Menu: ComponentType }
export type AdminSettingsProps = {
  mainLayoutProps: MainLayoutProps
  settingsItems: AdminSettingsItem[]
}

export const AdminSettings: FC<AdminSettingsProps> = ({ mainLayoutProps, settingsItems }) => {
  const [currSettingsItem, chooseSettingsItem] = useState(settingsItems[0])

  return (
    <MainLayout
      {...mainLayoutProps}
      streched={true}
      headerProps={{
        ...mainLayoutProps.headerProps,
      }}
    >
      <div className={`admin-settings`}>
        {
          <div className="left-menu" role="navigation">
            <Card role="navigation">
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

AdminSettings.displayName = 'AdminSettingsPage'
