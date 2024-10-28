import { fetchAllSchemaConfigs } from '../../../lib'
import { moduleCore } from '../../../types'

export const moodlenet_react_app_core: moduleCore<'moodlenetReactApp'> = {
  modName: 'moodlenetReactApp',
  service() {
    return
  },
  primary(ctx) {
    return {
      session: {
        async getWebappGlobalCtx() {
          const deployments = await ctx.forward.env.application.deployments()
          const allSchemaConfigs = await fetchAllSchemaConfigs({ primary: ctx.forward })
          const mySessionUserRecords = await ctx.forward.moodlenet.session.getMySessionUserRecords()
          const userAccount = mySessionUserRecords.type === 'authenticated' ? mySessionUserRecords.userAccountRecord : null
          return {
            allSchemaConfigs,
            deployments,
            session: {
              is: {
                admin: !!userAccount?.roles.includes('admin'),
                contributor: !!userAccount?.roles.includes('contributor'),
              },
              ...mySessionUserRecords,
            },
          }
        },
        async layouts() {
          const {
            configs: { layouts },
          } = await ctx.mod.secondary.env.query.modConfigs({ mod: 'moodlenetReactApp' })
          return layouts
        },
      },
    }
  },
}
