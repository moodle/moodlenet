import { createSession } from '@moodlenet/common/lib/graphql/auth/validation/input/userAuth'
import { webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { Home, Signup } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { useMemo, useState } from 'react'
import { useSession } from '../../context/Global/Session'
import { MutationCreateSessionArgs } from '../../graphql/pub.graphql.link'
import { useFormikWithBag } from '../../helpers/forms'
import { LoginFormValues, LoginPanelProps } from '../../ui/pages/Login'

const signupLink = webappPath<Signup>('/signup', {})
const homeLink = webappPath<Home>('/', {})

export const useLoginPanelProps = (): LoginPanelProps => {
  const { login, lastSessionUsername } = useSession()
  const [message, setMessage] = useState<string | null>(null)
  const [, form] = useFormikWithBag<LoginFormValues & MutationCreateSessionArgs>({
    initialValues: { password: '', username: lastSessionUsername || '' },
    validationSchema: createSession,
    validateOnChange: false,
    onSubmit({ password, username } /* , helpers */) {
      setMessage(null)
      return login({ password, username }).then(setMessage)
    },
  })

  return useMemo(() => ({ form, message, signupLink, homeLink }), [form, message])
}
