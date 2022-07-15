import { CSSProperties, FC, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, InputTextField } from '../../atoms'
import { MainLayout } from '../../layout'
import { SetCtx } from './set'
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
  const setCtx = useContext(SetCtx)

  const defaultSettingsItem = setCtx.settingsItems[0]
  const [currSettingsItem, chooseSettingsItem] = useState(defaultSettingsItem)
  useEffect(() => chooseSettingsItem(defaultSettingsItem), [defaultSettingsItem])

  const ctxElement = (
    <>
      {setCtx.settingsItems && setCtx.settingsItems.length > 1 && (
        <>{/* <span style={{ float: 'left', marginRight: '10px' }}>use:</span> */}</>
      )}
    </>
  )

  type SectionNameType = 'General' | 'Extensions'

  type SectionType = {
    name: SectionNameType
    // component: typeof Packages | typeof Modules
    displayName: 'General' | 'Extensions'
    link?: '/extensions'
  }

  const sections: SectionType[] = [
    { name: 'General', displayName: 'General' },
    { name: 'Extensions', displayName: 'Extensions', link: '/extensions' },
  ]

  const [currentSection, setCurrentSection] = useState('General')

  const menu = sections.map((e, i) => (
    <>
      {!e.link && (
        <div
          key={i}
          className={`section ${e.name === currentSection ? 'selected' : ''}`}
          onClick={() => {
            setCurrentSection(e.name)
          }}
        >
          {e.displayName}
        </div>
      )}
      {e.link && (
        <Link to={e.link} key={i} className={`section`}>
          {e.displayName}
        </Link>
      )}
    </>
  ))

  return (
    <div className="settings-page">
      <div className="left-menu">
        <Card>
          {menu}
          {setCtx.settingsItems.map((settingsItem, index) => {
            const isCurrent = settingsItem === currSettingsItem
            const css: CSSProperties = {
              float: 'left',
              cursor: isCurrent ? undefined : 'pointer',
              fontWeight: isCurrent ? 'bold' : undefined,
              display: isCurrent ? 'none' : 'block',
            }
            const onClick = isCurrent ? undefined : () => chooseSettingsItem(settingsItem)

            return (
              <div key={index} style={css} onClick={onClick}>
                <settingsItem.def.Menu />
              </div>
            )
          })}
        </Card>
      </div>
      <div className="content">
        {currSettingsItem ? <currSettingsItem.def.Content /> : null}
        {currentSection === 'General' && (
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
        )}
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
