import { webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { nodeId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { GlobalSearch, Landing, Login, Signup } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { useCallback, useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSession } from '../../context/Global/Session'
import { UserSessionFragment } from '../../context/Global/Session/session.gen'

export const mainPath = {
  login: webappPath<Login>('/login', {}),
  signUp: webappPath<Signup>('/signup', {}),
  landing: webappPath<Landing>('/', {}),
  search: webappPath<GlobalSearch>('/search', {}),
}

export const useRedirectToBySession = ({
  ifLogged,
  to,
  replace,
}: {
  to: string | ((_: UserSessionFragment | null) => string)
  ifLogged: boolean
  replace: boolean
}) => {
  const history = useHistory()
  const { session } = useSession()

  const shouldRedirect = !!ifLogged === !!session
  useLayoutEffect(() => {
    if (shouldRedirect) {
      const target = typeof to === 'string' ? to : to(session)
      setImmediate(() => {
        history[replace ? 'replace' : 'push'](target)
      })
    }
  }, [history, replace, session, shouldRedirect, to])
}

export const useRedirectHomeIfLoggedIn = () => {
  useRedirectToBySession({
    ifLogged: true,
    replace: true,
    to: mainPath.landing,
  })
}

export const useRedirectProfileHomeIfLoggedIn = () => {
  useRedirectToBySession({
    ifLogged: true,
    replace: true,
    to: useCallback((session: UserSessionFragment | null) => nodeId2UrlPath(session!.profile.id), []),
  })
}
