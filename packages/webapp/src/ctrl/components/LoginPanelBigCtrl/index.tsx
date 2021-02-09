import { t } from '@lingui/macro'
import { FC } from 'react'
import { useFormikWithBag } from '../../../helpers/forms'
import { LoginFormValues, LoginPanelBig } from '../../../ui/pages/Login'
import { useLoginMutation } from './login.gen'

export const LoginPanelBigCtrl: FC = () => {
  const [login, result] = useLoginMutation()
  const [formik, bag] = useFormikWithBag<LoginFormValues>({
    initialValues: { password: '', username: '' },
    onSubmit({ password, username } /* , helpers */) {
      return login({ variables: { password, username } })
    },
  })
  const message = !formik.isSubmitting && formik.submitCount && !result.data?.createSession ? t`wrong credentials` : ''

  return <LoginPanelBig form={bag} message={message} />
}
