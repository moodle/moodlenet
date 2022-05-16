import { Routes } from '@moodlenet/common/dist/webapp/sitemap'
import { useUserAgreementCtrl } from '../ui/components/pages/Policies/UserAgreement/Ctrl/UserAgreementCtrl'
import { UserAgreement } from '../ui/components/pages/Policies/UserAgreement/UserAgreement'
import { ctrlHook } from '../ui/lib/ctrl'
import { MNRouteProps, RouteFC } from './lib'

const UserAgreementComponent: RouteFC<
  Routes.UserAgreement
> = (/* { match } */) => {
  const userAgreementProps = ctrlHook(
    useUserAgreementCtrl,
    {},
    'user-agreement-page'
  )
  return <UserAgreement {...userAgreementProps} />
}

export const UserAgreementRoute: MNRouteProps<Routes.UserAgreement> = {
  component: UserAgreementComponent,
  path: '/user-agreement',
  exact: true,
}
