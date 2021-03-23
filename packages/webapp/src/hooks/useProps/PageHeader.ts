import { webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { Home, Login } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { useEffect, useMemo } from 'react'
import { useHistory } from 'react-router'
import { useSession } from '../../contexts/Global/Session'
import { UsePageHeaderProps } from '../../ui/components/PageHeader'
import { mainPath } from '../glob/nav'
import { useGlobalSearch } from '../glob/useGlobalSearch'

const homeLink = webappPath<Home>('/', {})
const loginLink = webappPath<Login>('/login', {})

let firstIn = true
export const getUsePageHeaderProps = (): UsePageHeaderProps =>
  function usePageHeaderProps() {
    const { logout, session } = useSession()
    const { searchText, setSearchText } = useGlobalSearch()
    const history = useHistory()
    useEffect(() => {
      if (searchText) {
        history[firstIn ? 'push' : 'replace'](`${mainPath.search}?q=${searchText}`)
        firstIn = false
      } else {
        firstIn = true
      }
    }, [history, searchText])

    return useMemo(
      () => ({
        homeLink,
        loginLink,
        logout,
        search: setSearchText,
        searchValue: searchText,
        username: session?.username ?? null,
      }),
      [logout, searchText, session?.username, setSearchText],
    )
  }
