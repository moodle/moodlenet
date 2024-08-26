import type { RequestHandler } from '@moodlenet/http-server/server'
import { mountApp, urlencoded } from '@moodlenet/http-server/server'
import { getCurrentProfileIds } from '@moodlenet/web-user/server'
// import Account from './account.mjs'

import assert from 'assert'
import type { InteractionResults } from 'oidc-provider'
import { shell } from '../shell.mjs'
const setNoCache: RequestHandler = (_req, res, next) => {
  res.set('cache-control', 'no-store')
  next()
}
const body = urlencoded({ extended: false })
// https://github.com/hyunrealshadow/oidc-provider/blob/dc6bde1e45875d69b7dfd53ef5abf79d0634bc0a/example/routes/express.js
shell.call(mountApp)({
  async getApp(express) {
    const { openIdProvider } = await import('./provider.mjs')
    const app = express()
    // app.set('trust proxy', true)

    app.post('/interaction/:uid/login', setNoCache, body, async (req, res, next) => {
      // shell.log('debug', '-/interaction/:uid/login LOGIN   ', req.params.uid)
      try {
        const currentWebUserProfile = await getCurrentProfileIds()
        assert(currentWebUserProfile, 'not authenticated')
        const {
          prompt: { name },
        } = await openIdProvider.interactionDetails(req, res)
        assert.equal(name, 'login', 'interaction not in login prompt')
        // const account = await Account.findByLogin(req.body.login)

        const result = {
          login: {
            accountId: currentWebUserProfile._key,
          },
        }

        await openIdProvider.interactionFinished(req, res, result, {
          mergeWithLastSubmission: false,
        })
      } catch (err) {
        // shell.log('debug', '-/interaction/:uid/login LOGIN ERR', err)
        next(err)
      }
    })

    app.post('/interaction/:uid/confirm', setNoCache, body, async (req, res, next) => {
      // shell.log('debug', '-/interaction/:uid/confirm CONFIRM   ', req.params.uid)
      try {
        const interactionDetails = await openIdProvider.interactionDetails(req, res)
        const {
          prompt: { name, details },
          params,
          session,
        } = interactionDetails
        assert(session, 'no session found')
        const { accountId } = session
        assert.equal(name, 'consent')

        const { grantId } = interactionDetails
        const grant = grantId
          ? // we'll be modifying existing grant in existing session
            await openIdProvider.Grant.find(grantId)
          : (() => {
              assert(typeof params.client_id === 'string' || params.client_id === undefined)
              // we're establishing a new grant
              return new openIdProvider.Grant({
                accountId,
                clientId: params.client_id,
              })
            })()

        assert(grant)

        if (Array.isArray(details.missingOIDCScope)) {
          grant.addOIDCScope(details.missingOIDCScope.join(' '))
        }
        if (Array.isArray(details.missingOIDCClaims)) {
          grant.addOIDCClaims(details.missingOIDCClaims)
        }
        if (details.missingResourceScopes) {
          for (const [indicator, scopes] of Object.entries(details.missingResourceScopes)) {
            grant.addResourceScope(indicator, [scopes].flat().join(' '))
          }
        }

        const savedGrantId = await grant.save()

        const result: InteractionResults = {
          consent: !interactionDetails.grantId
            ? {
                // we don't have to pass grantId to consent, we're just modifying existing one
                grantId: savedGrantId,
              }
            : {},
        }

        await openIdProvider.interactionFinished(req, res, result, {
          mergeWithLastSubmission: true,
        })
      } catch (err) {
        // shell.log('debug', '-/interaction/:uid/confirm CONFIRM ERR', err)
        next(err)
      }
    })

    app.get('/interaction/:uid/abort', setNoCache, async (req, res, next) => {
      // shell.log('debug', '-/interaction/:uid/abort ABORT   ', req.params.uid)
      // const details = await openIdProvider.interactionDetails(req, res)

      // shell.log('debug', '-/interaction/:uid/abort ABORT   ', details)
      try {
        const result = {
          error: 'access_denied',
          error_description: 'End-User aborted interaction',
        }
        await openIdProvider.interactionFinished(req, res, result, {
          mergeWithLastSubmission: false,
        })
      } catch (err) {
        next(err)
      }
    })

    // const ErrorRequestHandler: ErrorRequestHandler = (err, _req, _res, next) => {
    //   if (err instanceof AssertionError) {
    //     // shell.log('debug', 'OIDC interaction-endpoints Error Handler', req.url, err)
    //     // handle interaction expired / session not found error
    //   }
    //   next(err)
    // }
    // app.use(ErrorRequestHandler)

    return app
  },
  //mountOnAbsPath: '/.openid',
})
