import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { ctrlHook } from '../ui/lib/ctrl'
import { useNewPasswordCtrl } from '../ui/pages/Access/NewPassword/Ctrl/NewPassword'
import { NewPassword } from '../ui/pages/Access/NewPassword/NewPassword'
import { MNRouteProps, RouteFC } from './lib'

export const NewPasswordRouteComponent: RouteFC<Routes.NewPassword> = ({
  match: {
    params: { token },
  },
}) => {
  const props = ctrlHook(useNewPasswordCtrl, { recoverPasswordToken: token }, token)
  return <NewPassword {...props} />
}

export const NewPasswordRoute: MNRouteProps<Routes.NewPassword> = {
  component: NewPasswordRouteComponent,
  path: '/new-password/:token',
  exact: true,
}
