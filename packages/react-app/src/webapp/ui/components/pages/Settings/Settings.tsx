import { Menu as MenuIcon } from '@material-ui/icons'
import { FC, useEffect, useState } from 'react'
import MainLayout, { MainLayoutProps } from '../../layout/MainLayout/MainLayout.js'
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
  const [showMenu, toggleMenu] = useState(document.documentElement.clientWidth > 700 ? true : false)

  useEffect(() => {
    const handleResize = () => {
      document.documentElement.clientWidth > 700 && toggleMenu(true)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const headerLeftItems = [
    {
      Item: () => (
        <div
          onClick={() => toggleMenu(!showMenu)}
          className="header-menu-btn"
          key="header-menu-btn"
        >
          <MenuIcon className="menu-btn" />
        </div>
      ),
      key: 'header-menu-btn',
    },
  ]

  return (
    <MainLayout
      {...mainLayoutProps}
      headerProps={{
        ...mainLayoutProps.headerProps,
        leftItems: headerLeftItems,
      }}
    >
      <div className={`settings ${showMenu ? 'menu-visible' : 'menu-hidden'}`}>
        {showMenu && (
          <div className="left-menu">
            <Card>
              {settingsItems.map(settingsEntry => {
                const isCurrent = JSON.stringify(settingsEntry) === JSON.stringify(currSettingsItem)
                const onClick = isCurrent ? undefined : () => chooseSettingsItem(settingsEntry)

                return (
                  <div
                    key={settingsEntry.Menu.key}
                    className={`section ${isCurrent ? 'selected' : ''}`}
                    onClick={onClick}
                  >
                    {<settingsEntry.Menu.Item />}
                  </div>
                )
              })}
            </Card>
          </div>
        )}
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
