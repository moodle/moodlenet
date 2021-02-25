import { Home, Login } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { FC, useEffect } from 'react'
import { useHistory } from 'react-router'
import { mainPath } from '../../../ctrl/helpers/nav'
import { webappLinkDef } from '../../../helpers/navigation'
import { PageHeader } from '../../../ui/components/PageHeader'
import { HeaderElement } from '../../../ui/context'
import { useGlobalSearchText } from '../Router'
import { useSession } from '../Session'

const homeLink = webappLinkDef<Home>('/', {})
const loginLink = webappLinkDef<Login>('/login', {})
export const HeaderElementProvider: FC = ({ children }) => {
  const { logout, session } = useSession()
  const [searchText, setSearchText] = useGlobalSearchText()
  const history = useHistory()
  useEffect(() => {
    if (searchText) {
      history.push(`${mainPath.search}?q=${searchText}`)
    }
  }, [history, searchText])

  const Header = (
    <PageHeader
      searchValue={searchText}
      search={setSearchText}
      homeLink={homeLink}
      loginLink={loginLink}
      logout={logout}
      username={session?.username ?? null}
    />
  )
  return <HeaderElement.Provider value={Header}>{children}</HeaderElement.Provider>
}
