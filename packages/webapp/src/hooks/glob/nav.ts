import { webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import * as Routes from '@moodlenet/common/lib/webapp/sitemap/routes'
import { useCallback, useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSession } from '../../context/Global/Session'
import { UserSessionFragment } from '../../context/Global/Session/session.gen'

export const mainPath = {
  termsAndConditionsHref: webappPath<Routes.TermsAndConditions>('/terms', {}),
  login: webappPath<Routes.Login>('/login/:activationEmailToken?', {}),
  firstLogin: (activationEmailToken: string) =>
    webappPath<Routes.Login>('/login/:activationEmailToken?', { activationEmailToken }),
  recoverPassword: webappPath<Routes.RecoverPassword>('/recover-password', {}),
  signUp: webappPath<Routes.Signup>('/signup', {}),
  landing: webappPath<Routes.Landing>('/', {}),
  search: webappPath<Routes.GlobalSearch>('/search', {}),
  createNewResource: webappPath<Routes.CreateNewResource>('/create-new-resource', {}),
  createNewCollection: webappPath<Routes.CreateNewCollection>('/create-new-collection', {}),
  bookmarks: webappPath<Routes.BookmarksPage>('/bookmarks', {}),
  following: webappPath<Routes.FollowingPage>('/following', {}),
  cookiesPolicies: webappPath<Routes.CookiesPolicies>('/cookies-policies', {}),
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
    to: useCallback((session: UserSessionFragment | null) => nodeGqlId2UrlPath(session!.profile.id), []),
    delay: opts?.delay,
  })
}
