import { useFormik } from 'formik'
import { FC, useContext, useEffect } from 'react'
import { Card, InputTextField, PrimaryButton } from '../../atoms'
import { SettingsCtx } from './SettingsContext'

export type OrganizationData = {
  instanceName: string
  landingTitle: string
  landingSubtitle: string
}

export const GeneralContent: FC = () => {
  const setCtx = useContext(SettingsCtx)

  useEffect(() => {
    form.setValues(setCtx.organizationData)
  }, [setCtx.organizationData])

  const form = useFormik<OrganizationData>({
    initialValues: setCtx.organizationData,
    async onSubmit(data) {
      setCtx.saveOrganization(data)
      // console.log('save data')
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
                value={form.values.instanceName}
                onChange={form.handleChange}
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
                value={form.values.landingTitle}
                onChange={form.handleChange}
                name="landingTitle"
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
                value={form.values.landingSubtitle}
                onChange={form.handleChange}
                name="landingSubtitle"
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
