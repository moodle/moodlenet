'/extensions'
import { FC, useContext, useMemo, useState } from 'react'
import { Card } from '../../atoms'
import { MainLayout } from '../../layout'
import { SettingsSectionItem } from './SettingsContext'
// import { Link } from '../../../../elements/link'
import { MainContext } from '../../../../connect-react-app-lib'
import { RegistryEntry } from '../../../../main-lib/registry'
import Appearance from './Appearance'
import { GeneralContent } from './General'
import './Settings.scss'

export type SettingsProps = {}

export const Settings: FC<SettingsProps> = () => {
  return (
    <MainLayout>
      <SettingsBody />
    </MainLayout>
  )
}
export const SettingsBody: FC<SettingsProps> = ({}) => {
  // const setCtx = useContext(SettingsCtx)
  const {
    shell,
    registries: {
      settings: { sections },
    },
  } = useContext(MainContext)
  const { registry: sectionsReg } = sections.useRegistry()
  const settingsItems = useMemo(() => {
    const baseSettingsItems: RegistryEntry<SettingsSectionItem>[] = [
      { pkg: shell.pkg, item: { Menu: () => <span>General</span>, Content: GeneralContent } },
      { pkg: shell.pkg, item: { Menu: () => <span>Appearance</span>, Content: Appearance } },
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
          {settingsItems.map((settingsEntry, index) => {
            const isCurrent = settingsEntry === currSettingsItem

            const onClick = isCurrent ? undefined : () => chooseSettingsItem(settingsEntry)

            return (
              <div
                key={`${settingsEntry.pkg}:${index}`}
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
