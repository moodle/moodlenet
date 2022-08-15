'/extensions'
import { FC, useContext, useMemo, useState } from 'react'
import { Card } from '../../atoms'
import { MainLayout } from '../../layout'
import { SettingItem, SettingsCtx } from './SettingsContext'
// import { Link } from '../../../../elements/link'
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
  const setCtx = useContext(SettingsCtx)

  const [currSettingsItem, chooseSettingsItem] = useState(baseSettingsItems[0]!)
  const settingsItems = useMemo(() => baseSettingsItems.concat(setCtx.settingsItems), [setCtx.settingsItems])
  const ctxElement = (
    <>
      {setCtx.settingsItems.length > 1 && <>{/* <span style={{ float: 'left', marginRight: '10px' }}>use:</span> */}</>}
    </>
  )

  return (
    <div className="settings-page">
      <div className="left-menu">
        <Card>
          {settingsItems.map((settingsItem, index) => {
            const isCurrent = settingsItem === currSettingsItem

            const onClick = isCurrent ? undefined : () => chooseSettingsItem(settingsItem)

            return (
              <div
                key={index}
                className={`section ${settingsItem === currSettingsItem ? 'selected' : ''}`}
                onClick={onClick}
              >
                <settingsItem.def.Menu />
              </div>
            )
          })}
        </Card>
      </div>
      <div className="content">
        {currSettingsItem ? <currSettingsItem.def.Content /> : null}

        {ctxElement}
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

const baseSettingsItems: SettingItem[] = [
  { def: { Menu: () => <span>General</span>, Content: GeneralContent } },
  // { def: { Menu: () => <span>Extensions</span>, Content: () => <Navigate to={'/extensions'} /> } },
  { def: { Menu: () => <span>Appearance</span>, Content: Appearance } },
]
