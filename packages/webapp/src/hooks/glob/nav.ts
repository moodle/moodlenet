import { webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { GlobalSearch, Home, Login } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSession } from '../../context/Global/Session'

export const mainPath = {
  login: webappPath<Login>('/login', {}),
  home: webappPath<Home>('/', {}),
  search: webappPath<GlobalSearch>('/search', {}),
}

export const useRedirectToBySession = ({
  ifLogged,
  to,
  replace,
}: {
  to: string
  ifLogged: boolean
  replace: boolean
}) => {
  const history = useHistory()
  const { session } = useSession()

  const shouldRedirect = !!ifLogged === !!session
  useLayoutEffect(() => {
    if (shouldRedirect) {
      setImmediate(() => {
        history[replace ? 'replace' : 'push'](to)
      })
    }
  }, [history, replace, shouldRedirect, to])
}

export const useRedirectHomeIfLoggedIn = () => {
  useRedirectToBySession({
    ifLogged: true,
    replace: true,
    to: mainPath.home,
  })
}
