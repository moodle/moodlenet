/* eslint-disable prettier/prettier */
import {
  Card,
  InputTextField,
  PrimaryButton,
  Snackbar,
  SnackbarStack,
} from '@moodlenet/component-library'
import { useFormik } from 'formik'
import type { FC } from 'react'

export type SimpleEmailUserSettingsData = {
  email: string
  password: string
}

export type SimpleEmailUserSettingsProps = {
  data: SimpleEmailUserSettingsData
  emailChangedSuccess: boolean
  passwordChangedSuccess: boolean
  editData: (values: SimpleEmailUserSettingsData) => void
}

export const GeneralMenu = () => <abbr title="General">General</abbr>

export const SimpleEmailUserSettings: FC<SimpleEmailUserSettingsProps> = ({
  data,
  editData,
  emailChangedSuccess,
  passwordChangedSuccess,
}) => {
  const form = useFormik<SimpleEmailUserSettingsData>({
    initialValues: data,
    // validationSchema: resourceValidationSchema,
    onSubmit: values => {
      return editData(values)
    },
  })

  const canSubmit =
    form.dirty &&
    // form.isValid &&
    !form.isSubmitting &&
    !form.isValidating &&
    (form.values.email !== data.email || form.values.password !== data.password)

  const shouldShowErrors = !!form.submitCount

  const snackbars = (
    <SnackbarStack
      snackbarList={[
        emailChangedSuccess ? (
          <Snackbar type="success">Check your old email inbox to continue</Snackbar>
        ) : null,
        passwordChangedSuccess ? <Snackbar type="success">Password changed</Snackbar> : null,
      ]}
    ></SnackbarStack>
  )

  return (
    <Card className="column">
      {snackbars}
      <div className="parameter">
        <div className="name">Email</div>
        <div className="actions">
          <InputTextField
            className="email"
            placeholder="Enter your account email"
            defaultValue={form.values.email}
            onChange={form.handleChange}
            name="email"
            key="email"
            error={shouldShowErrors && form.errors.email}
          />
        </div>
      </div>
      <div className="parameter">
        <div className="name">Password</div>
        <div className="actions">
          <InputTextField
            className="password"
            placeholder="Enter your new password"
            defaultValue={form.values.password}
            onChange={form.handleChange}
            type="password"
            name="password"
            key="password"
            error={shouldShowErrors && form.errors.password}
          />
        </div>
      </div>
      <PrimaryButton onClick={() => form.submitForm()} disabled={!canSubmit} className="save-btn">
        Save
      </PrimaryButton>
    </Card>
  )
}
