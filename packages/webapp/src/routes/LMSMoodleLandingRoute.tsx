import { Routes } from '@moodlenet/common/dist/webapp/sitemap'
import { useLmsMoodleLandingCtrl } from '../ui/components/pages/LmsMoodleLanding/Ctrl/LmsMoodleLandingCtrl'
import { LMSMoodleLanding } from '../ui/components/pages/LmsMoodleLanding/LmsMoodleLanding'
import { ctrlHook } from '../ui/lib/ctrl'
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
