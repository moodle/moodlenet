import { useSession } from '../../../../context/Global/Session'
import { CtrlHook } from '../../../lib/ctrl'
import { MainPageWrapperProps } from '../MainPageWrapper'

export const useMainPageWrapperCtrl: CtrlHook<MainPageWrapperProps, {}> = () => {
  const { userMustAcceptPolicies } = useSession()
  const mainPageWrapperProps: MainPageWrapperProps = {
    userAcceptsPolicies: userMustAcceptPolicies,
  }
  return [mainPageWrapperProps]
}
