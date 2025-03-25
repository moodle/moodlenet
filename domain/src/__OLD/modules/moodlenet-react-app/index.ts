import { d_u, ok_ko } from '@moodle/lib-types'
import { moodlenetContributorId } from '../moodlenet/types'
import { profileInfo } from '../user-profile'
import type { landingLayoutProps, Layouts, moodlenetCategories, webappContributorAccessData, webappGlobals } from './types'
import { PageLayouts } from './types/layouts/page'
import { RootLayouts } from './types/layouts/root'
export * from './types'

export default interface MoodlenetReactAppDomain {
  event: { moodlenetReactApp: unknown }
  service: { moodlenetReactApp: unknown }
  primary: {
    moodlenetReactApp: {
      props: {
        allLayouts(): Promise<Layouts>
        rootLayout(): Promise<ok_ko<{ webappGlobalCtx: webappGlobals }, { cleanupSession: unknown }>>
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
      query: {
        moodlenetCategories(): Promise<{ moodlenetCategories: moodlenetCategories }>
      }
      service?: unknown
      write?: unknown
      sync?: unknown
    }
  }
}
