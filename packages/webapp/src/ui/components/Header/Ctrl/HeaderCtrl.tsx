import { useMemo } from 'react'
import { useSession } from '../../../../context/Global/Session'
import { getMaybeAssetRefUrl } from '../../../../helpers/data'
import { mainPath } from '../../../../hooks/glob/nav'
import { href } from '../../../elements/link'
import { CtrlHook } from '../../../lib/ctrl'
import { defaultOrganization } from '../../../lib/static-data'
import { useSearchUrlQuery } from '../../../pages/Search/Ctrl/useSearchUrlQuery'
import { HeaderProps, HeaderPropsIdle } from '../Header'

export const useHeaderCtrl: CtrlHook<HeaderProps, {}> = () => {
  const { session, logout, currentProfile } = useSession()
  const { setText: setSearchText, text: searchText } = useSearchUrlQuery()
  const headerProps = useMemo<HeaderProps>(() => {
    const me: HeaderPropsIdle['me'] =
      currentProfile && session
        ? {
            avatar: getMaybeAssetRefUrl(currentProfile.icon) ?? '',
            username: session.username,
            logout,
          }
        : null
    return {
      status: 'idle',
      me,
      homeHref: href(mainPath.landing),
      loginHref: href(mainPath.login),
      organization: defaultOrganization,
      searchText,
      setSearchText,
    }
  }, [currentProfile, logout, searchText, session, setSearchText])
  return [headerProps]
}
