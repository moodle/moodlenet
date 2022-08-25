import { FC, useContext } from 'react'
import { Card, InputTextField, PrimaryButton } from '../../atoms'
import { SettingsCtx } from './SettingsContext'

export const GeneralContent: FC = () => {
  const setCtx = useContext(SettingsCtx)
  const save = ():void=>{
    //setCtx
    setCtx.setInstanceName(setCtx.instanceName)
    setCtx.setLandingTitle(setCtx.landingTitle)
    setCtx.setInstanceName(setCtx.landingSubtitle)
    console.log('save data')
  }
  return (
    <>
      <Card>
        <div className="title">General settings</div>
        <div>Manage your preferences</div>
      </Card>
      <Card>
        <div className="parameter">
          <div>          <PrimaryButton
            className={`install-btn`}
            disabled={false}
            onClick={save}
          ></div>
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
