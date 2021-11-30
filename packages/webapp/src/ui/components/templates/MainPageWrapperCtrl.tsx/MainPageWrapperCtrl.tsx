import { useSession } from '../../../../context/Global/Session'
import { mainPath } from '../../../../hooks/glob/nav'
import { href } from '../../../elements/link'
import { CtrlHook } from '../../../lib/ctrl'
import { MainPageWrapperProps } from '../MainPageWrapper'

export const useMainPageWrapperCtrl: CtrlHook<
  MainPageWrapperProps,
  {}
> = () => {
  const { userMustAcceptPolicies } = useSession()
  const mainPageWrapperProps: MainPageWrapperProps = {
    userAcceptsPolicies: userMustAcceptPolicies,
    cookiesPolicyHref: href(mainPath.cookiesPolicy),
  }
  return [mainPageWrapperProps]
}
