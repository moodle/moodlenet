import { useFormik } from 'formik'
import { FC, useContext } from 'react'
import { Card, InputTextField, PrimaryButton } from '../../atoms'
import { SettingsCtx } from './SettingsContext'

export type OrganizationData = {
  instanceName:string;
  landingTitle:string;
  landingSubtitle:string;
}

export const GeneralContent: FC = () => {
  const setCtx = useContext(SettingsCtx)

  const form = useFormik<OrganizationData>({
    initialValues: { instanceName: '', landingTitle: '', landingSubtitle: '' },
    async onSubmit(data:any) {
      setCtx.saveOrganization(data as OrganizationData)
      console.log('save data')
    },
  })

  return (
    <>
      <Card>
        <div className="title">General settings</div>
        <div>Manage your preferences</div>
      </Card>
      <Card>
      <form onSubmit={form.handleSubmit}>
        <div className="parameter">
        <PrimaryButton type="submit">Save</PrimaryButton>
          <div className="name">Site name</div>
          <div className="actions">
            <InputTextField
              className="instance-name"
              placeholder="Give a name to your site"
              value={setCtx.organizationData.instanceName}
              name="instanceName"
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
              value={setCtx.organizationData.landingTitle}
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
              value={setCtx.organizationData.landingSubtitle}
              name="landing-subtitle"
              edit
              // error={shouldShowErrors && editForm.errors.displayName}
            />
          </div>
        </div>
        </form>
      </Card>
    </>
  )
}
