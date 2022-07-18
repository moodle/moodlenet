'/extensions'
import { FC, useContext, useMemo, useState } from 'react'
import { Card, InputTextField } from '../../atoms'
import { MainLayout } from '../../layout'
import { SettingItem, SettingsCtx } from './SettingsContext'
// import { Link } from '../../../../elements/link'
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

  console.log({ settingsItems: setCtx.settingsItems })
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

const GeneralContent: FC = () => {
  const setCtx = useContext(SettingsCtx)
  return (
    <>
      <Card>
        <div className="title">General settings</div>
        <div>Manage your preferences</div>
      </Card>
      <Card>
        <div className="parameter">
          <div className="name">Site name</div>
          <div className="actions">
            <InputTextField
              className="instance-name"
              placeholder="Give a name to your site"
              value={setCtx.instanceName}
              onChange={(t: any) => setCtx.setInstanceName(t.currentTarget.value)}
              name="instance-name"
              edit
              // error={shouldShowErrors && editForm.errors.displayName}
            />
          </div>
        </div>
        <div className="parameter">
          <div className="name">Landing page title</div>
          <div className="actions">
            <InputTextField
              textarea={true}
              className="landing-title"
              placeholder="Give a title to the landing page"
              value={setCtx.landingTitle}
              onChange={(t: any) => setCtx.setLandingTitle(t.currentTarget.value)}
              name="landing-title"
              edit
              // error={shouldShowErrors && editForm.errors.displayName}
            />
          </div>
        </div>
        <div className="parameter">
          <div className="name">Landing page subtitle</div>
          <div className="actions">
            <InputTextField
              textarea={true}
              className="landing-subtitle"
              placeholder="Give a subtitle to the landing page"
              value={setCtx.landingSubtitle}
              onChange={(t: any) => setCtx.setLandingSubtitle(t.currentTarget.value)}
              name="landing-subtitle"
              edit
              // error={shouldShowErrors && editForm.errors.displayName}
            />
          </div>
        </div>
      </Card>
    </>
  )
}

const baseSettingsItems: SettingItem[] = [
  { def: { Menu: () => <span>General</span>, Content: GeneralContent } },
  // { def: { Menu: () => <span>Extensions</span>, Content: () => <Navigate to={'/extensions'} /> } },
]
