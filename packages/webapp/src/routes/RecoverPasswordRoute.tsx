import { Routes } from '@moodlenet/common/dist/webapp/sitemap'
import { useRecoverPasswordCtrl } from '../ui/components/pages/Access/RecoverPassword/Ctrl/RecoverPassword'
import { RecoverPassword } from '../ui/components/pages/Access/RecoverPassword/RecoverPassword'
import { ctrlHook } from '../ui/lib/ctrl'
import { MNRouteProps, RouteFC } from './lib'

export const RecoverPasswordRouteComponent: RouteFC<
  Routes.RecoverPassword
> = (/* { match } */) => {
  const props = ctrlHook(useRecoverPasswordCtrl, {}, 'recoverpassword-route')
  return <RecoverPassword {...props} />
}

export const RecoverPasswordRoute: MNRouteProps<Routes.RecoverPassword> = {
  component: RecoverPasswordRouteComponent,
  path: '/recover-password',
  exact: true,
}
