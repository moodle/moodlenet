import type { ComponentType, FC } from 'react'
import { useState } from 'react'
import type { MainLayoutProps } from '../../layout/MainLayout/MainLayout.js'
import MainLayout from '../../layout/MainLayout/MainLayout.js'
// import { Link } from '../../../../elements/link'
// import { RegistryEntry } from '../../../../main-lib/registry'
import { Card } from '@moodlenet/component-library'
// import '@moodlenet/component-library/ui/scss/application'
import './AdminSettings.scss'

export type AdminSettingsItem = { key: string; Content: ComponentType; Menu: ComponentType }
export type AdminSettingsProps = {
  mainLayoutProps: MainLayoutProps
  settingsItems: AdminSettingsItem[]
}

export const AdminSettings: FC<AdminSettingsProps> = ({ mainLayoutProps, settingsItems }) => {
  console.log({ settingsItems })
  const [currSettingsItemKey, chooseSettingsItemKey] = useState(settingsItems[0]?.key)
  const CurrentContentComponent = settingsItems.find(_ => _.key === currSettingsItemKey)?.Content
  return (
    <MainLayout
      {...mainLayoutProps}
      headerProps={{
        ...mainLayoutProps.headerProps,
      }}
    >
      <div className={`admin-settings`}>
        {
          <div className="menu-container" role="navigation">
            <Card role="navigation" className="menu">
              {settingsItems.map(settingsItem => {
                const isCurrent = settingsItem.key === currSettingsItemKey
                const onClick = isCurrent
                  ? undefined
                  : () => chooseSettingsItemKey(settingsItem.key)

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
        {CurrentContentComponent && (
          <div className="content" key={currSettingsItemKey}>
            <CurrentContentComponent />
            {/* {ctxElement} */}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

AdminSettings.displayName = 'AdminSettingsPage'
