import { webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { Home, Login } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { useCallback, useLayoutEffect } from 'react'
import { useHistory } from 'react-router'
import { useSession } from '../../contexts/Global/Session'

export const mainPath = {
  login: webappPath<Login>('/login', {}),
  home: webappPath<Home>('/', {}),
}

export const useNavToBySession = ({ ifLogged, to, replace }: { to: string; ifLogged: boolean; replace: boolean }) => {
  const history = useHistory()
  const { session } = useSession()
  const go = useCallback(() => {
    history[replace ? 'replace' : 'push'](to)
  }, [history, replace, to])

  useLayoutEffect(() => {
    if (!!ifLogged === !!session) {
      go()
    }
  }, [go, ifLogged, session])
}

export const useRedirectHomeIfLoggedIn = () =>
  useNavToBySession({
    ifLogged: true,
    replace: true,
    to: mainPath.home,
  })
