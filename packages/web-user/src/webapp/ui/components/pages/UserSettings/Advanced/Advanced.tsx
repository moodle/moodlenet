/* eslint-disable prettier/prettier */
import { Card, InputTextField, PrimaryButton } from '@moodlenet/component-library'
import type { useFormik } from 'formik'
import type { FC } from 'react'
import './Advanced.scss'

export type AdvancedProps = {
  form: ReturnType<typeof useFormik<{ instanceName: string }>>
  updateSuccess?: boolean
  updateExtensions?: () => void
}

export const AdvancedMenu = () => <abbr title="Advanced">LMS</abbr>

export const Advanced: FC<AdvancedProps> = ({ form, updateSuccess, updateExtensions }) => {
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
    <div className="advanced" key="advanced">
      {update}
      {updatedSuccessfully}
      <Card className="column">
        <div className="title">
          {/* <Trans> */}
          LMS
          {/* </Trans> */}
          <PrimaryButton onClick={form.submitForm} disabled={!canSubmit} className="save-btn">
            Save
          </PrimaryButton>
        </div>
      </Card>
      <Card className="column">
        <div className="parameter">
          <div className="name"> Platform name</div>
          <div className="actions">
            <InputTextField
              className="instance-name"
              placeholder="Enter name of your LMS platform"
              defaultValue={form.values.instanceName}
              onChange={form.handleChange}
              name="instanceName"
              key="instance-name"
              error={shouldShowErrors && form.errors.instanceName}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
