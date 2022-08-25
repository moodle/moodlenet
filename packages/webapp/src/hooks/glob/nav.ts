import { webappPath } from '@moodlenet/common/dist/webapp/sitemap'
import { nodeGqlId2UrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import * as Routes from '@moodlenet/common/dist/webapp/sitemap/routes'
import { useCallback, useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSession } from '../../context/Global/Session'
import { UserSessionFragment } from '../../context/Global/Session/session.gen'

export const mainPath = {
  login: webappPath<Routes.Login>('/login/:activationEmailToken?', {}),
  firstLogin: (activationEmailToken: string) =>
    webappPath<Routes.Login>('/login/:activationEmailToken?', {
      activationEmailToken,
    }),
  recoverPassword: webappPath<Routes.RecoverPassword>('/recover-password', {}),
  signUp: webappPath<Routes.Signup>('/signup', {}),
  landing: webappPath<Routes.Landing>('/', {}),
  search: webappPath<Routes.GlobalSearch>('/search', {}),
  createNewResource: webappPath<Routes.CreateNewResource>(
    '/create-new-resource',
    {}
  ),
  createNewCollection: webappPath<Routes.CreateNewCollection>(
    '/create-new-collection',
    {}
  ),
  bookmarks: webappPath<Routes.BookmarksPage>('/bookmarks', {}),
  following: webappPath<Routes.FollowingPage>('/following', {}),
  followers: ({ nodeId }: { nodeId: string }) => {
    const [__typename, slug] = nodeId.split('/') as [string, string]
    return webappPath<Routes.FollowersPage>('/followers/:__typename/:slug', {
      slug,
      __typename,
    })
  },
  settings: webappPath<Routes.SettingsPage>('/settings', {}),
  cookiesPolicy: webappPath<Routes.CookiesPolicy>('/cookies-policy', {}),
  userAgreement: webappPath<Routes.UserAgreement>('/user-agreement', {}),
}

export const useRedirectToBySession = ({
  ifLogged,
  to,
  replace,
  delay = 0,
}: {
  to: string | ((_: UserSessionFragment | null) => string)
  ifLogged: boolean
  replace: boolean
  delay?: number
}) => {
  const history = useHistory()
  const { session } = useSession()

  const shouldRedirect = !!ifLogged === !!session
  useLayoutEffect(() => {
    if (shouldRedirect) {
      const targetRedirect = typeof to === 'string' ? to : to(session)
      const schedule = delay ? setTimeout : setImmediate
      schedule(() => {
        history[replace ? 'replace' : 'push'](targetRedirect)
      }, delay)
    }
  }, [delay, history, replace, session, shouldRedirect, to])
}

export const useRedirectHomeIfLoggedIn = (opts?: { delay?: number }) => {
  useRedirectToBySession({
    ifLogged: true,
    replace: true,
    to: mainPath.landing,
    delay: opts?.delay,
  })
}

export const useRedirectProfileHomeIfLoggedIn = (opts?: { delay?: number }) => {
  useRedirectToBySession({
    ifLogged: true,
    replace: true,
    to: useCallback((session: UserSessionFragment | null) => {
      return session ? nodeGqlId2UrlPath(session.profile.id) : '' //FIXME: what if not session ?
    }, []),
    delay: opts?.delay,
  })
}
