import { useSession } from '../../../../context/Global/Session'
import { CtrlHook } from '../../../lib/ctrl'
import { MainPageWrapperProps } from '../MainPageWrapper'

export const useMainPageWrapperCtrl: CtrlHook<MainPageWrapperProps, {}> = () => {
  const { userMustAcceptCookies } = useSession()
  const mainPageWrapperProps: MainPageWrapperProps = {
    userAcceptsCookies: userMustAcceptCookies,
  }
  return [mainPageWrapperProps]
}
