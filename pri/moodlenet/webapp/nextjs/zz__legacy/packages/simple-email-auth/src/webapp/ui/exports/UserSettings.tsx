/* eslint-disable prettier/prettier */
import { Card, InputTextField, PrimaryButton, Snackbar } from '@moodlenet/component-library'
import { useFormik } from 'formik'
import type { FC } from 'react'

export type SetPasswordData = {
  // email: string
  password: string
}

export type SimpleEmailUserSettingsProps = {
  // data: SimpleEmailUserSettingsData
  // emailChangedSuccess: boolean
  passwordChangedSuccess: boolean
  setPassword: (values: SetPasswordData) => void
}

export const GeneralMenu = () => <abbr title="General">General</abbr>

export const SimpleEmailUserSettings: FC<SimpleEmailUserSettingsProps> = ({
  // data,
  setPassword,
  // emailChangedSuccess,
  passwordChangedSuccess,
}) => {
  const form = useFormik<SetPasswordData>({
    initialValues: { password: '' },
    // validationSchema: resourceValidationSchema,
    onSubmit: values => {
      return setPassword(values)
    },
  })

  // form.values.email !== data.email ||
  // form.values.password !== data.password


  const snackbars =
    // <SnackbarStack
    // snackbarList={
    [
      // emailChangedSuccess ? (
      //   <Snackbar type="success">Check your old email inbox to continue</Snackbar>
      // ) : null,
      passwordChangedSuccess ? <Snackbar type="success">Password changed</Snackbar> : null,
    ]
  // }
  // ></SnackbarStack>

  return (
  )
}
