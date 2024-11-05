import { d_u, ok_ko } from '@moodle/lib-types'
import { currentMoodlenetSessionData, moodlenetContributorId } from '../moodlenet/types'
import { profileInfo } from '../user-profile'
import type { landingLayoutProps, Layouts, webappContributorAccessData, webappGlobals } from './types'
import { PageLayouts } from './types/layouts/page'
import { RootLayouts } from './types/layouts/root'
export * from './types'

export default interface MoodlenetReactAppDomain {
  event: { moodlenetReactApp: unknown }
  service: { moodlenetReactApp: unknown }
  primary: {
    moodlenetReactApp: {
      session: {
        data(): Promise<currentMoodlenetSessionData>
      }
      props: {
        allLayouts(): Promise<Layouts>
        rootLayout(): Promise<{ webappGlobalCtx: webappGlobals }>
        mainLayout(): Promise<{
          session: d_u<
            {
              guest: unknown
              authenticated: {
                contributorId: moodlenetContributorId
                profileInfo: profileInfo
                hasAdminSectionAccess: boolean
              }
            },
            'type'
          >
          mainLayout: RootLayouts['main']
        }>
        simpleLayout(): Promise<{
          simpleLayout: RootLayouts['simple']
        }>
        signupPage(): Promise<{
          signupPageLayout: PageLayouts['signup']
        }>
        loginPage(): Promise<{
          loginPageLayout: PageLayouts['login']
        }>
        profilePage(_: {
          moodlenetContributorId: moodlenetContributorId
        }): Promise<ok_ko<webappContributorAccessData, { notFound: unknown; notAllowed: unknown }>>
        landingLayout(): Promise<landingLayoutProps>
      }
    }
  }
  secondary: {
    moodlenetReactApp: {
      query?: unknown
      service?: unknown
      write?: unknown
      sync?: unknown
    }
  }
}
