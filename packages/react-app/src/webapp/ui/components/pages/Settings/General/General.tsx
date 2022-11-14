import { AddonItem, Card, InputTextField, PrimaryButton } from '@moodlenet/component-library'
import { OrganizationData } from '@moodlenet/organization'
import { useFormik } from 'formik'
import { FC } from 'react'
import './General.scss'

export type GeneralProps = {
  form: ReturnType<typeof useFormik<OrganizationData>>
}

export const GeneralMenu: AddonItem = 
{
  Item: () => <span>General</span>,
  key: 'menu-general',
}


export const General: FC<GeneralProps> = ({ form }) => {
  const canSubmit = form.dirty && form.isValid && !form.isSubmitting && !form.isValidating
  return (
    <div className="general" key="general">
      <Card>
        <div className="title">
          {/* <Trans> */}
          General
          {/* </Trans> */}
          <PrimaryButton onClick={form.submitForm} disabled={!canSubmit} className="save-btn">
            Save
          </PrimaryButton>
        </div>
        <div className="parameter">
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
              textarea
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
              textarea
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
      </Card>
    </div>
  )
}
