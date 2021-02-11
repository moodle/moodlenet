import { t } from '@lingui/macro'
import { createSession } from '@moodlenet/common/lib/graphql/validation/input/user-account'
import { Signup } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { FC } from 'react'
import { MutationCreateSessionArgs } from '../../graphql/pub.graphql.link'
import { useFormikWithBag } from '../../helpers/forms'
import { webappLinkDef } from '../../helpers/navigation'
import { LoginFormValues, LoginPanelBig } from '../../ui/pages/Login'
import { useLoginMutation } from './LoginPanelBigCtrl/login.gen'

const signupLink = webappLinkDef<Signup>('/signup', {})
export const LoginPanelBigCtrl: FC = () => {
  const [login, result] = useLoginMutation()
  const [formik, bag] = useFormikWithBag<LoginFormValues & MutationCreateSessionArgs>({
    initialValues: { password: '', username: '' },
    validationSchema: createSession,
    validateOnChange: false,
    onSubmit({ password, username } /* , helpers */) {
      return login({ variables: { password, username } })
    },
  })
  const message = !formik.isSubmitting && formik.submitCount && !result.data?.createSession ? t`wrong credentials` : ''

  return <LoginPanelBig form={bag} message={message} signupLink={signupLink} />
}
