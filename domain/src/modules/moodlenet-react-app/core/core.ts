import { fetchAllSchemaConfigs } from '../../../lib'
import { moduleCore, moodlePrimary } from '../../../types'
import { isMeMoodlenetContributorRecord } from '../../moodlenet/core/lib/primary-access'
import { validate_currentUserSessionInfo } from '../../user-account/lib'
import { landingLayoutProps, suggestedContent } from '../types/webapp/pageProps/landing'
import { accessWebappContributorAccessData, contributorRecordToWebappContributorAccessData } from './lib'

type primary = moodlePrimary['moodlenetReactApp']
export const moodlenet_react_app_core: moduleCore<'moodlenetReactApp'> = {
  modName: 'moodlenetReactApp',
  service() {
    return
  },
  primary(ctx) {
    return {
      async session() {
        const session: primary['session'] = {
          async data() {
            const mySessionUserRecords = await ctx.forward.moodlenet.session.getMySessionUserRecords()
            // const userAccount = mySessionUserRecords.type === 'authenticated' ? mySessionUserRecords.userAccountRecord : null
            // const moodlenetReactAppSessionData: moodlenetReactAppSessionData = {
            //   is: {
            //     admin: !!userAccount?.roles.includes('admin'),
            //     contributor: !!userAccount?.roles.includes('contributor'),
            //   },
            //   ...mySessionUserRecords,
            // }
            return mySessionUserRecords
          },
        }
        return session
      },
      async props() {
        const props: primary['props'] = {
          async allLayouts() {
            const {
              configs: { layouts },
            } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'moodlenetReactApp' })
            return layouts
          },
          async rootLayout() {
            const moodlenetConfigs = await ctx.forward.moodlenet.session.moduleInfo()
            const { filestoreHttp } = await ctx.forward.env.application.deployments()
            const allSchemaConfigs = await fetchAllSchemaConfigs({ primary: ctx.forward })
            const session = await ctx.forward.moodlenetReactApp.session.data()
            // .catch<moodlenetReactAppSessionData>(() => ({
            //   type: 'guest',
            //   is: {
            //     admin: false,
            //     contributor: false,
            //     authenticated: false,
            //   },
            // }))

            return {
              webappGlobalCtx: {
                allSchemaConfigs,
                filestoreHttpDeployment: filestoreHttp,
                session,
                pointSystem: moodlenetConfigs.pointSystem,
                moodlenetSiteInfo: moodlenetConfigs.info,
              },
            }
          },
          async mainLayout() {
            const [session, layouts] = await Promise.all([
              ctx.forward.moodlenetReactApp.session.data(),
              ctx.forward.moodlenetReactApp.props.allLayouts(),
            ])
            return {
              session:
                session.type === 'authenticated'
                  ? {
                      type: 'authenticated',
                      contributorId: session.moodlenetContributorRecord.id,
                      hasAdminSectionAccess: session.userAccountRecord.roles.includes('admin'),
                      profileInfo: session.userProfileRecord.info,
                    }
                  : { type: 'guest' },
              mainLayout: layouts.roots.main,
            }
          },
          async simpleLayout() {
            const layouts = await ctx.forward.moodlenetReactApp.props.allLayouts()
            return {
              simpleLayout: layouts.roots.simple,
            }
          },
          async signupPage() {
            const layouts = await ctx.forward.moodlenetReactApp.props.allLayouts()
            return {
              signupPageLayout: layouts.pages.signup,
            }
          },
          async loginPage() {
            const layouts = await ctx.forward.moodlenetReactApp.props.allLayouts()
            return {
              loginPageLayout: layouts.pages.login,
            }
          },
          async landingLayout() {
            const userSessionInfo = await validate_currentUserSessionInfo({ ctx })
            const { info: moodlenetSiteInfo } = await ctx.forward.moodlenet.session.moduleInfo()
            const layouts = await ctx.forward.moodlenetReactApp.props.allLayouts()
            const { moodlenetContributorRecords } = await ctx.mod.secondary.moodlenet.query.contributors({
              range: [20],
              sort: ['points', 'DESC'],
            })
            const myUserRecords = await ctx.forward.moodlenet.session.getMySessionUserRecords()
            const me = myUserRecords.type === 'authenticated' ? myUserRecords.moodlenetContributorRecord : null

            const leaderContributors = moodlenetContributorRecords.map(moodlenetContributorRecord =>
              contributorRecordToWebappContributorAccessData({ moodlenetContributorRecord, me }),
            )

            const suggestedContent: suggestedContent = {
              contributors: [],
            }
            const landingLayoutProps: landingLayoutProps = {
              authenticatedUser: !!userSessionInfo.authenticated,
              moodlenetSiteInfo,
              landingPageLayout: layouts.pages.landing,
              landingPageData: {
                suggestedContent,
                leaderContributors,
              },
            }
            return landingLayoutProps
          },
          async profilePage({ moodlenetContributorId }) {
            const [hasAccess, resultWebappContributorAccessData] = await accessWebappContributorAccessData({
              ctx,
              id: moodlenetContributorId,
            })
            if (!hasAccess) {
              return [false, resultWebappContributorAccessData]
            }

            return [true, resultWebappContributorAccessData]
          },
        }
        return props
      },
    }
  },
}

