import { webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { Home, Login } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { useSession } from '../../contexts/Global/Session'
import { UsePageHeaderProps } from '../../ui/components/PageHeader'
import { mainPath } from '../glob/nav'
import { useGlobalSearch } from '../glob/useGlobalSearch'

const homeLink = webappPath<Home>('/', {})
const loginLink = webappPath<Login>('/login', {})

export const getUsePageHeaderProps = (): UsePageHeaderProps =>
  function usePageHeaderProps() {
    const { logout, session } = useSession()
    const { searchText, setSearchText } = useGlobalSearch()
    const history = useHistory()
    useEffect(() => {
      if (searchText) {
        history.push(`${mainPath.search}?q=${searchText}`)
      }
    }, [history, searchText])

    return {
      homeLink,
      loginLink,
      logout,
      search: setSearchText,
      searchValue: searchText,
      username: session?.username ?? null,
    }
  }
