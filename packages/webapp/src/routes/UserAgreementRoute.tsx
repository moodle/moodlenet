import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { ctrlHook } from '../ui/lib/ctrl'
import { useUserAgreementCtrl } from '../ui/pages/Policies/UserAgreement/Ctrl/UserAgreementCtrl'
import { UserAgreement } from '../ui/pages/Policies/UserAgreement/UserAgreement'
import { MNRouteProps, RouteFC } from './lib'

const UserAgreementComponent: RouteFC<Routes.UserAgreement> = (/* { match } */) => {
  const userAgreementProps = ctrlHook(useUserAgreementCtrl, {}, 'user-agreement-page')
  return <UserAgreement {...userAgreementProps} />
}

export const UserAgreementRoute: MNRouteProps<Routes.UserAgreement> = {
  component: UserAgreementComponent,
  path: '/user-agreement',
  exact: true,
}
