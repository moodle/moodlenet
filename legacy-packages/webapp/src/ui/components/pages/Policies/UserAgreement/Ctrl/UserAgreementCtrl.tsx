import { ctrlHook, CtrlHook } from '../../../../../lib/ctrl'
import { useMainPageWrapperCtrl } from '../../../../templates/MainPageWrapperCtrl.tsx/MainPageWrapperCtrl'
import { useAccessHeaderCtrl } from '../../../Access/AccessHeader/Ctrl/AccessHeaderCtrl'
import { UserAgreementProps } from '../UserAgreement'

export const useUserAgreementCtrl: CtrlHook<UserAgreementProps, {}> = () => {
  const userAgreementProps: UserAgreementProps = {
    accessHeaderProps: ctrlHook(useAccessHeaderCtrl, {}, 'access-header'),
    mainPageWrapperProps: ctrlHook(
      useMainPageWrapperCtrl,
      {},
      'main-page-wrapper'
    ),
  }
  return [userAgreementProps]
}
