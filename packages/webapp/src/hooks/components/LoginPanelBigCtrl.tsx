import { createSession } from '@moodlenet/common/lib/graphql/validation/input/userAuth'
import { Home, Signup } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { useState } from 'react'
import { useSession } from '../../contexts/Global/Session'
import { MutationCreateSessionArgs } from '../../graphql/pub.graphql.link'
import { useFormikWithBag } from '../../helpers/forms'
import { webappLinkDef } from '../../helpers/navigation'
import { LoginFormValues, UseLoginPanelProps } from '../../ui/pages/Login'

const signupLink = webappLinkDef<Signup>('/signup', {})
const homeLink = webappLinkDef<Home>('/', {})

export const getUseLoginPanelProps = (): UseLoginPanelProps =>
  function useLoginPanelProps() {
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

    return { form, message, signupLink, homeLink }
  }
