import { useSession } from '../../../../context/Global/Session'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useHeaderPageCtrl } from '../../../pages/HeaderPage/Ctrl/HeaderPageCtrl'
import { HeaderPageTemplateProps } from '../HeaderPageTemplate'
import { useMainPageWrapperCtrl } from '../MainPageWrapperCtrl.tsx/MainPageWrapperCtrl'

export const useHeaderPageTemplateCtrl: CtrlHook<HeaderPageTemplateProps, {}> = () => {
  const { isAuthenticated } = useSession()
  const headerPageTemplateProps: HeaderPageTemplateProps = {
    isAuthenticated,
    mainPageWrapperProps: ctrlHook(useMainPageWrapperCtrl, {}, 'main-page-wrapper'),
    headerPageProps: ctrlHook(useHeaderPageCtrl, {}, 'header-page'),
  }
  return [headerPageTemplateProps]
}
