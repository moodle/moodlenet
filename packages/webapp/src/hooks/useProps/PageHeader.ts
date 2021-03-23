import { webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { Home, Login } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { useMemo } from 'react'
import { useSession } from '../../contexts/Global/Session'
import { UsePageHeaderProps } from '../../ui/components/PageHeader'
import { useGlobalSearch } from '../glob/useGlobalSearch'

const homeLink = webappPath<Home>('/', {})
const loginLink = webappPath<Login>('/login', {})

export const getUsePageHeaderProps = (): UsePageHeaderProps =>
  function usePageHeaderProps() {
    const { logout, session } = useSession()
    const { searchText, setSearchText } = useGlobalSearch()

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
