import { t } from '@lingui/macro'
import { createSession } from '@moodlenet/common/lib/graphql/validation/input/user-account'
import { webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { Home, Signup } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { FC, useEffect } from 'react'
import { useHistory } from 'react-router'
import { MutationCreateSessionArgs } from '../../graphql/pub.graphql.link'
import { useFormikWithBag } from '../../helpers/forms'
import { webappLinkDef } from '../../helpers/navigation'
import { LoginFormValues, LoginPanelBig } from '../../ui/pages/Login'
import { useLoginMutation } from './LoginPanelBigCtrl/login.gen'

const signupLink = webappLinkDef<Signup>('/signup', {})
const homeLink = webappLinkDef<Home>('/', {})
export const LoginPanelBigCtrl: FC = () => {
  const history = useHistory()
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
  useEffect(() => {
    if (result.data?.createSession) {
      history.push(webappPath<Home>('/', {}))
    }
  }, [history, result.data?.createSession])
  return <LoginPanelBig form={bag} message={message} signupLink={signupLink} homeLink={homeLink} />
}
