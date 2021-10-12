import { Routes } from 'my-moodlenet-common/lib/webapp/sitemap'
import { ctrlHook } from '../ui/lib/ctrl'
import { useLmsMoodleLandingCtrl } from '../ui/pages/LmsMoodleLanding/Ctrl/LmsMoodleLandingCtrl'
import { LMSMoodleLanding } from '../ui/pages/LmsMoodleLanding/LmsMoodleLanding'
import { MNRouteProps, RouteFC } from './lib'

const LMSMoodleLandingRouteComponent: RouteFC<Routes.LMSMoodleLanding> = () => {
  const props = ctrlHook(useLmsMoodleLandingCtrl, {}, 'login-route')
  return <LMSMoodleLanding {...props} />
}

export const LMSMoodleLandingRoute: MNRouteProps<Routes.LMSMoodleLanding> = {
  component: LMSMoodleLandingRouteComponent,
  exact: true,
  path: '/lms/moodle/search',
}
