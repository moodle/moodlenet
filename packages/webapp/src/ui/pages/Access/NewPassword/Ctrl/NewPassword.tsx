import { useCallback, useMemo, useState } from 'react'
import { useSession } from '../../../../../context/Global/Session'
import { useRedirectProfileHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { SubmitForm, useFormikBag } from '../../../../lib/formik'
import { useAccessHeaderCtrl } from '../../AccessHeader/Ctrl/AccessHeaderCtrl'
import { NewPasswordFormValues, NewPasswordProps } from '../NewPassword'

export const useNewPasswordCtrl: CtrlHook<NewPasswordProps, { recoverPasswordToken: string }> = ({
  recoverPasswordToken,
}) => {
  useRedirectProfileHomeIfLoggedIn({ delay: 618 })
  const { changeRecoverPassword } = useSession()
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState<string | null>(null)
  const onSubmit = useCallback<SubmitForm<NewPasswordFormValues>>(
    ({ newPassword }) =>
      changeRecoverPassword({ newPassword, recoverPasswordToken }).then(err => {
        setNewPasswordErrorMessage(err)
      }),
    [changeRecoverPassword, recoverPasswordToken],
  )
  const [, formBag] = useFormikBag<NewPasswordFormValues>({
    initialValues: { newPassword: '' },
    onSubmit,
  })
  const newPasswordProps = useMemo<NewPasswordProps>(() => {
    const newPasswordProps: NewPasswordProps = {
      accessHeaderProps: ctrlHook(useAccessHeaderCtrl, {}, 'New Password Access Header'),
      formBag,
      newPasswordErrorMessage,
    }
    return newPasswordProps
  }, [formBag, newPasswordErrorMessage])

  return newPasswordProps && [newPasswordProps]
}
