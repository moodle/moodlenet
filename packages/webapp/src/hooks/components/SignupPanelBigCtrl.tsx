import { signUp } from '@moodlenet/common/lib/graphql/validation/input/userAuth'
import { webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { Home } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { MutationSignUpArgs } from '../../graphql/pub.graphql.link'
import { useFormikWithBag } from '../../helpers/forms'
import { SignupFormValues, UseSignupPanelProps } from '../../ui/components/SignupPanelBig'
import { useSignUpMutation } from './SignupPanelBigCtrl/signup.gen'

const homeLink = webappPath<Home>('/', {})

export const getUseSignupPanelProps = (): UseSignupPanelProps =>
  function useSignupPanelProps() {
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
    return { form, warnMessage, homeLink, signUpSucceded }
  }
