import { FC, useContext, useMemo, useState } from 'react'
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

export type SettingsProps = {}

export const Settings: FC<SettingsProps> = () => {
  return (
    <MainLayout>
      <SettingsBody />
    </MainLayout>
  )
}
export const SettingsBody: FC<SettingsProps> = ({}) => {
  const { pkgId } = useContext(MainContext)
  const { registry: sectionsReg } = registries.settingsSections.useRegistry()
  const settingsItems = useMemo(() => {
    const baseSettingsItems: RegistryEntry<SettingsSectionItem>[] = [
      { pkgId, item: { Menu: () => <span>General</span>, Content: GeneralContent } },
      { pkgId, item: { Menu: () => <span>Appearance</span>, Content: Appearance } },
      // { def: { Menu: () => <span>Extensions</span>, Content: () => <Navigate to={'/extensions'} /> } },
    ]
    return baseSettingsItems.concat(sectionsReg.entries)
  }, [sectionsReg])

  const [currSettingsItem, chooseSettingsItem] = useState(settingsItems[0]!)
  // const ctxElement = (
  //   <>
  //     {setCtx.settingsItems.length > 1 && <>{/* <span style={{ float: 'left', marginRight: '10px' }}>use:</span> */}</>}
  //   </>
  // )

  return (
    <div className="settings-page">
      <div className="left-menu">
        <Card>
          {settingsItems.map(settingsEntry => {
            const isCurrent = settingsEntry === currSettingsItem

            const onClick = isCurrent ? undefined : () => chooseSettingsItem(settingsEntry)

            return (
              <div
                key={`${settingsEntry.pkgId.name}@${settingsEntry.pkgId.version}`}
                className={`section ${settingsEntry === currSettingsItem ? 'selected' : ''}`}
                onClick={onClick}
              >
                <settingsEntry.item.Menu />
              </div>
            )
          })}
        </Card>
      </div>
      <div className="content">
        {currSettingsItem ? <currSettingsItem.item.Content /> : null}
        {/* {ctxElement} */}
      </div>
    </div>
    // <div className="login-page">
    //   <div className="content">
    //     <Card>
    //       <div className="content">
    //         <div className="title">Log in</div>
    //       </div>
    //     </Card>
    //     <Card hover={true}>
    //       <Link to={`/signup`}>
    //         Sign up
    //         <CallMadeIcon />
    //       </Link>
    //     </Card>
    //   </div>
    // </div>
  )
}

Settings.displayName = 'SettingsPage'
