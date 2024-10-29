import { ok_ko } from '@moodle/lib-types'
import { moodlenetContributorId } from '../moodlenet/types'
import type { Layouts, moodlenetReactAppSessionData, webappGlobalCtx } from './types'
import { PageLayouts } from './types/layouts/page'
import { RootLayouts } from './types/layouts/root'
import { profilePageProps } from './types/webapp/pageProps'
import { landingPageProps } from './types/webapp/pageProps/landing'
export * from './types'

export default interface MoodlenetReactAppDomain {
  event: { moodlenetReactApp: unknown }
  service: { moodlenetReactApp: unknown }
  primary: {
    moodlenetReactApp: {
      session: {
        data(): Promise<moodlenetReactAppSessionData>
      }
      props: {
        allLayouts(): Promise<Layouts>
        rootLayout(): Promise<{ webappGlobalCtx: webappGlobalCtx }>
        mainLayout(): Promise<{
          session: moodlenetReactAppSessionData
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
        }): Promise<ok_ko<profilePageProps, { notFound: unknown }>>
        landingLayout(): Promise<{
          landingPageLayout: PageLayouts['landing']
          landingPageProps: landingPageProps
        }>
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
