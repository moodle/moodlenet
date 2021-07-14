import { signUp } from '@moodlenet/common/lib/graphql/auth/validation/input/userAuth'
import { webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { Home } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { useMemo } from 'react'
import { MutationSignUpArgs } from '../../graphql/pub.graphql.link'
import { useFormikWithBag } from '../../helpers/forms'
import { SignupFormValues, SignupPanelProps } from '../../ui/components/SignupPanelBig'
import { useSignUpMutation } from './SignupPanel/signup.gen'

const homeLink = webappPath<Home>('/', {})

export const useSignupPanelProps = (): SignupPanelProps => {
  const [signup, result] = useSignUpMutation()
  const [, form] = useFormikWithBag<SignupFormValues & MutationSignUpArgs>({
    initialValues: { email: '' },
    validationSchema: signUp,
    validateOnChange: false,
    onSubmit({ email } /* , helpers */) {
      return signup({ variables: { email } })
    },
  })
  const warnMessage = result.data?.signUp.message ?? ''
  const signUpSucceded = !!result.data?.signUp.success
  return useMemo(() => ({ form, warnMessage, homeLink, signUpSucceded }), [form, signUpSucceded, warnMessage])
}
