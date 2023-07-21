import { instanceDomain } from '@moodlenet/core'
import { mountApp } from '@moodlenet/http-server/server'
import { getWebappUrl } from '@moodlenet/react-app/server'
import { setPkgCurrentUser } from '@moodlenet/system-entities/server'
import { getProfileHomePageRoutePath } from '@moodlenet/web-user/common'
import { getProfileRecord, getWebUser } from '@moodlenet/web-user/server'
import { shell } from '../shell.mjs'

export type WebFingerResp = {
  subject: string
  aliases: string[]
  links: [
    {
      rel: 'http://webfinger.example/rel/profile-page'
      href: string
    },
  ]
}

shell.call(mountApp)({
  mountOnAbsPath: '/.well-known',
  getApp: function getHttpApp(express) {
    const app = express()
    const acctResourceParam = new RegExp(`^acct:[a-zA-Z0-9._-]+@${instanceDomain.split('://')[1]}$`)
    app.get<unknown, WebFingerResp | string, unknown, { resource: string }>(
      '/webfinger',
      async (req, res) => {
        const resParam = req.query.resource
        if ('string' !== typeof resParam || !acctResourceParam.test(resParam)) {
          res.status(400).send(`Bad Request resource:${JSON.stringify(resParam)}`)
          return
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const acct = resParam.split(':')[1]!
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const webUserKey = acct.split('@')[0]!
        await setPkgCurrentUser()
        const webUser = await getWebUser({ _key: webUserKey })
        if (!webUser) return notFound()
        const profile = await getProfileRecord(webUser.profileKey)
        if (!profile) return notFound()

        const profileUrl = getWebappUrl(
          getProfileHomePageRoutePath({
            _key: profile.entity._key,
            displayName: profile.entity.displayName,
          }),
        )
        const resp: WebFingerResp = {
          subject: profileUrl,
          aliases: [profileUrl],
          links: [
            {
              rel: 'http://webfinger.example/rel/profile-page',
              href: profileUrl,
            },
          ],
        }

        res.send(resp)
        function notFound() {
          res.status(404).send(`user ${resParam} not found ${JSON.stringify(webUser, null, 2)}`)
        }
      },
    )
    return app
  },
})
