import { webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { Home, Login } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSession } from '../../contexts/Global/Session'

export const mainPath = {
  login: webappPath<Login>('/login', {}),
  home: webappPath<Home>('/', {}),
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

  console.log({ ifLogged, session }, !!ifLogged === !!session)

  useLayoutEffect(() => {
    if (!!ifLogged === !!session) {
      setImmediate(() => {
        history[replace ? 'replace' : 'push'](to)
      })
    }
  }, [history, ifLogged, replace, session, to])
}

export const useRedirectHomeIfLoggedIn = () => {
  useRedirectToBySession({
    ifLogged: true,
    replace: false,
    to: mainPath.home,
  })
}
