import { useSession } from '../../../../context/Global/Session'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useHeaderPageCtrl } from '../../../pages/HeaderPage/Ctrl/HeaderPageCtrl'
import { HeaderPageTemplateProps } from '../HeaderPageTemplate'

export const useHeaderPageTemplateCtrl: CtrlHook<HeaderPageTemplateProps, {}> = () => {
  const { isAuthenticated } = useSession()
  const headerPageTemplateProps: HeaderPageTemplateProps = {
    isAuthenticated,
    headerPageProps: ctrlHook(useHeaderPageCtrl, {}),
  }
  return [headerPageTemplateProps]
}
