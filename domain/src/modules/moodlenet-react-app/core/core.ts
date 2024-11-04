import { fetchAllSchemaConfigs } from '../../../lib'
import { moduleCore } from '../../../types'
import { accessMoodlenetContributor } from '../../moodlenet/core/lib/primary-access'
import { moodlenetReactAppSessionData, profilePageData } from '../types'
import { suggestedContent } from '../types/webapp/pageProps/landing'
import { mapContributorToMinimalInfo } from './lib'

export const moodlenet_react_app_core: moduleCore<'moodlenetReactApp'> = {
  modName: 'moodlenetReactApp',
  service() {
    return
  },
  primary(ctx) {
    return {
      async session() {
        return {
          async data() {
            const mySessionUserRecords = await ctx.forward.moodlenet.session.getMySessionUserRecords()
            const userAccount = mySessionUserRecords.type === 'authenticated' ? mySessionUserRecords.userAccountRecord : null
            const moodlenetReactAppSessionData: moodlenetReactAppSessionData = {
              is: {
                admin: !!userAccount?.roles.includes('admin'),
                contributor: !!userAccount?.roles.includes('contributor'),
              },
              ...mySessionUserRecords,
            }
            return moodlenetReactAppSessionData
          },
        }
      },
      async props() {
        return {
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
            const session = await ctx.forward.moodlenetReactApp.session.data().catch<moodlenetReactAppSessionData>(() => ({
              type: 'guest',
              is: {
                admin: false,
                contributor: false,
                authenticated: false,
              },
            }))
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
              session,
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
            const layouts = await ctx.forward.moodlenetReactApp.props.allLayouts()
            const { moodlenetContributorRecords } = await ctx.mod.secondary.moodlenet.query.contributors({
              range: [20],
              sort: ['points', 'DESC'],
            })
            const leaderContributors = moodlenetContributorRecords.map(mapContributorToMinimalInfo)

            const suggestedContent: suggestedContent = {
              contributors: [],
            }
            return {
              landingPageLayout: layouts.pages.landing,
              landingPageProps: {
                suggestedContent,
                leaderContributors,
              },
            }
          },
          async profilePage({ moodlenetContributorId }) {
            const foundMoodlenetContributorAccessObject = await accessMoodlenetContributor({
              ctx,
              id: moodlenetContributorId,
            })
            if (
              foundMoodlenetContributorAccessObject.result === 'notFound' ||
              foundMoodlenetContributorAccessObject.access === 'notAllowed'
            ) {
              return [false, { reason: 'notFound' }]
            }

            const profilePageData: profilePageData = {
              moodlenetContributorAccessObject: foundMoodlenetContributorAccessObject,
              stats: {
                followersCount: 66666,
                followingCount: foundMoodlenetContributorAccessObject.linkedContent.follow.moodlenetContributors.length,
                publishedResourcesCount: foundMoodlenetContributorAccessObject.contributions.eduResources.length,
              },
            }
            return [true, profilePageData]
          },
        }
      },
    }
  },
}
