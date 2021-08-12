import { webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { nodeGqlId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { CreateNewResource, GlobalSearch, Landing, Login, Signup } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { useCallback, useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSession } from '../../context/Global/Session'
import { UserSessionFragment } from '../../context/Global/Session/session.gen'

export const mainPath = {
  login: webappPath<Login>('/login', {}),
  signUp: webappPath<Signup>('/signup', {}),
  landing: webappPath<Landing>('/', {}),
  search: webappPath<GlobalSearch>('/search', {}),
  createNewResource: webappPath<CreateNewResource>('/create-new-resource', {}),
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
