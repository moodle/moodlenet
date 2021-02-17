import { createSession } from '@moodlenet/common/lib/graphql/validation/input/user-account'
import { Home, Signup } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { FC, useState } from 'react'
import { useSession } from '../../contexts/Global/Session'
import { MutationCreateSessionArgs } from '../../graphql/pub.graphql.link'
import { useFormikWithBag } from '../../helpers/forms'
import { webappLinkDef } from '../../helpers/navigation'
import { LoginFormValues, LoginPanelBig } from '../../ui/pages/Login'

const signupLink = webappLinkDef<Signup>('/signup', {})
const homeLink = webappLinkDef<Home>('/', {})
export const LoginPanelBigCtrl: FC = () => {
  const { login, lastSessionUsername } = useSession()
  const [message, setMessage] = useState<string | null>(null)
  const [, bag] = useFormikWithBag<LoginFormValues & MutationCreateSessionArgs>({
    initialValues: { password: '', username: lastSessionUsername || '' },
    validationSchema: createSession,
    validateOnChange: false,
    onSubmit({ password, username } /* , helpers */) {
      setMessage(null)
      return login({ password, username }).then(setMessage)
    },
  })

  return <LoginPanelBig form={bag} message={message} signupLink={signupLink} homeLink={homeLink} />
}
