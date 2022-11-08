import { Card, InputTextField, PrimaryButton } from '@moodlenet/component-library'
import { useFormik } from 'formik'
import { FC, useContext, useEffect } from 'react'
import { OrganizationCtx, OrganizationData } from '../../../../../context/OrganizationCtx.js'
export const GeneralContent: FC = () => {
  const orgCtx = useContext(OrganizationCtx)

  const form = useFormik<OrganizationData>({
    initialValues: orgCtx.organizationData,
    async onSubmit(data) {
      orgCtx.saveOrganization(data)
      // console.log('save data')
    },
  })
  useEffect(() => {
    form.setValues(orgCtx.organizationData)
  }, [form, orgCtx.organizationData])

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
