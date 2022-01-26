import { t } from '@lingui/macro'
import { useFormik } from 'formik'
import { useCallback, useMemo, useState } from 'react'
import { object, SchemaOf, string } from 'yup'
import { useSession } from '../../../../../../context/Global/Session'
import { useRedirectProfileHomeIfLoggedIn } from '../../../../../../hooks/glob/nav'
import { ctrlHook, CtrlHook } from '../../../../../lib/ctrl'
import { SubmitForm } from '../../../../../lib/formik'
import { useMainPageWrapperCtrl } from '../../../../templates/MainPageWrapperCtrl.tsx/MainPageWrapperCtrl'
import { useAccessHeaderCtrl } from '../../AccessHeader/Ctrl/AccessHeaderCtrl'
import { NewPasswordFormValues, NewPasswordProps } from '../NewPassword'

const validationSchema: SchemaOf<NewPasswordFormValues> = object({
  newPassword: string()
    .required(t`Please provide your new password`)
    .max(30)
    .min(6, 'Password is too short should be 6 chars minimum.'),
})
export const useNewPasswordCtrl: CtrlHook<
  NewPasswordProps,
  { recoverPasswordToken: string }
> = ({ recoverPasswordToken }) => {
  useRedirectProfileHomeIfLoggedIn({ delay: 618 })
  const { changeRecoverPassword } = useSession()
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState<
    string | null
  >(null)
  const onSubmit = useCallback<SubmitForm<NewPasswordFormValues>>(
    ({ newPassword }) =>
      changeRecoverPassword({ newPassword, recoverPasswordToken }).then(
        (err) => {
          setNewPasswordErrorMessage(err)
        }
      ),
    [changeRecoverPassword, recoverPasswordToken]
  )
  const form = useFormik<NewPasswordFormValues>({
    initialValues: { newPassword: '' },
    onSubmit,
    validationSchema,
  })
  const newPasswordProps = useMemo<NewPasswordProps>(() => {
    const newPasswordProps: NewPasswordProps = {
      accessHeaderProps: ctrlHook(
        useAccessHeaderCtrl,
        {},
        'New Password Access Header'
      ),
      form,
      newPasswordErrorMessage,
      mainPageWrapperProps: ctrlHook(
        useMainPageWrapperCtrl,
        {},
        'main-page-wrapper'
      ),
    }
    return newPasswordProps
  }, [form, newPasswordErrorMessage])

  return newPasswordProps && [newPasswordProps]
}
