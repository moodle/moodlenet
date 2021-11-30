import { ctrlHook, CtrlHook } from '../../../../../lib/ctrl'
import { useMainPageWrapperCtrl } from '../../../../templates/MainPageWrapperCtrl.tsx/MainPageWrapperCtrl'
import { useAccessHeaderCtrl } from '../../../Access/AccessHeader/Ctrl/AccessHeaderCtrl'
import { CookiesPolicyProps } from '../CookiesPolicy'

export const useCookiesPolicyCtrl: CtrlHook<CookiesPolicyProps, {}> = () => {
  const cookiesPolicyProps: CookiesPolicyProps = {
    accessHeaderProps: ctrlHook(useAccessHeaderCtrl, {}, 'access-header'),
    mainPageWrapperProps: ctrlHook(
      useMainPageWrapperCtrl,
      {},
      'main-page-wrapper'
    ),
  }
  return [cookiesPolicyProps]
}
