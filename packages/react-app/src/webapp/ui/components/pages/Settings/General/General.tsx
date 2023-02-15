/* eslint-disable prettier/prettier */
import { AddonItem, Card, InputTextField, PrimaryButton } from '@moodlenet/component-library'
import { OrganizationData } from '@moodlenet/organization'
import { useFormik } from 'formik'
import { FC } from 'react'
import './General.scss'

export type GeneralProps = {
  form: ReturnType<typeof useFormik<OrganizationData>>
  updateSuccess?: boolean
  updateExtensions?: () => void
}

export const GeneralMenu: AddonItem = {
  Item: () => <span>General</span>,
  key: 'menu-general',
}

export const General: FC<GeneralProps> = ({ form, updateSuccess, updateExtensions }) => {
  const canSubmit = form.dirty && form.isValid && !form.isSubmitting && !form.isValidating
  const shouldShowErrors = !!form.submitCount

  const update = updateExtensions && (
    <Card className="update">
      <div className="left">
        <div className="title">New update available!</div>
        <div className="description">Get the newest features and improvements in one click</div>
      </div>
      <div className="right">
        <PrimaryButton onClick={updateExtensions} className="update-btn">
          Update
        </PrimaryButton>
      </div>
    </Card>
  )
  const updatedSuccessfully = updateSuccess && (
    <Card className="update">
      <div className="left">
        <div className="title">Updated successfully!</div>
        <div className="description">
          Your app is up and running on the lastest release. Have fun!{' '}
        </div>
      </div>
      <div className="right">
        <div className="confetti">🎉</div>
      </div>
    </Card>
  )

  return (
    <div className="general" key="general">
      {update}
      {updatedSuccessfully}
      <Card className="column">
        <div className="title">
          {/* <Trans> */}
          General
          {/* </Trans> */}
          <PrimaryButton onClick={form.submitForm} disabled={!canSubmit} className="save-btn">
            Save
          </PrimaryButton>
        </div>
      </Card>
      <Card className="column">
        <div className="parameter">
          <div className="name">Site name</div>
          <div className="actions">
            <InputTextField
              className="instance-name"
              placeholder="Give a name to your site"
              defaultValue={form.values.instanceName}
              onChange={form.handleChange}
              name="instanceName"
              key="instance-name"
              error={shouldShowErrors && form.errors.instanceName}
            />
          </div>
        </div>
        <div className="parameter">
          <div className="name">Landing page title</div>
          <div className="actions">
            <InputTextField
              isTextarea
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
              isTextarea
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
