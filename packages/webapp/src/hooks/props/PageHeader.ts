import { webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { Home, Login } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { useMemo } from 'react'
import { useGlobalSearch } from '../../contexts/Global/GlobalSearch'
import { useSession } from '../../contexts/Global/Session'
import { PageHeaderProps } from '../../ui/components/PageHeader'

const homeLink = webappPath<Home>('/', {})
const loginLink = webappPath<Login>('/login', {})

export const usePageHeaderProps = (): PageHeaderProps => {
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
