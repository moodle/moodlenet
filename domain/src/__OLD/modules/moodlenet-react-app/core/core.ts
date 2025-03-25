import { fetchAllSchemaConfigs } from '../../../lib'
import { isError4xx, moduleCore, moodlePrimary } from '../../../types'
import { validate_currentUserSessionInfo } from '../../user-account/lib'
import { landingLayoutProps, suggestedContent } from '../types/webapp/pageProps/landing'
import { accessWebappContributorAccessData, contributorRecordToWebappContributorAccessData } from './lib'

type primary = moodlePrimary['moodlenetReactApp']
export const moodlenet_react_app_core: moduleCore<'moodlenetReactApp'> = {
  moduleName: 'moodlenetReactApp',
  service() {
    return
  },
  primary(ctx) {
    return {
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
            const { moodlenetCategories } = await ctx.mod.secondary.moodlenetReactApp.query.moodlenetCategories()
            const { filestoreHttp } = await ctx.forward.env.application.deployments()
            const allSchemaConfigs = await fetchAllSchemaConfigs({ primary: ctx.forward })
            const currentMoodlenetSessionData = await ctx.forward.moodlenet.session
              .getMyCurrentMoodlenetSessionData()
              .catch(error => {
                if (!isError4xx(error)) {
                  throw error
                }
                return 'cleanupSession' as const
              })

            if (currentMoodlenetSessionData === 'cleanupSession') {
              return [false, { reason: currentMoodlenetSessionData }]
            }

            return [
              true,
              {
                webappGlobalCtx: {
                  allSchemaConfigs,
                  filestoreHttpDeployment: filestoreHttp,
                  currentMoodlenetSessionData,
                  // session,
                  pointSystem: moodlenetConfigs.pointSystem,
                  // moodlenetSiteInfo: moodlenetConfigs.info,
                  moodlenetCategories,
                  serverTimeMs: Date.now(),
                },
              },
            ]
          },
          async mainLayout() {
            const [session, layouts] = await Promise.all([
              ctx.forward.moodlenet.session.getMyCurrentMoodlenetSessionData(),
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
            const myUserRecords = await ctx.forward.moodlenet.session.getMyCurrentMoodlenetSessionData()
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

