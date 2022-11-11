import { Menu as MenuIcon } from '@material-ui/icons'
import { FC, ReactElement, useEffect, useState } from 'react'
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
  const [showMenu, toggleMenu] = useState(document.documentElement.clientWidth > 700 ? true : false)

  useEffect(() => {
    const handleResize = () => {
      document.documentElement.clientWidth > 700 && toggleMenu(true)
    }
    console.log('being called')
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
      streched={true}
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
        )}
        <div className="content">
          {currSettingsItem ? currSettingsItem.Content : null}
          {/* {ctxElement} */}
        </div>
      </div>
    </MainLayout>
  )
}

Settings.displayName = 'SettingsPage'
