import { nodeId2UrlPath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { useMemo } from 'react'
import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { useSession } from '../../../../context/Global/Session'
import { getMaybeAssetRefUrl } from '../../../../helpers/data'
import { mainPath } from '../../../../hooks/glob/nav'
import { href } from '../../../elements/link'
import { CtrlHook } from '../../../lib/ctrl'
import { useSearchUrlQuery } from '../../../pages/Search/Ctrl/useSearchUrlQuery'
import { HeaderProps, HeaderPropsIdle } from '../Header'
export const useHeaderCtrl: CtrlHook<HeaderProps, {}> = () => {
  const { session, logout } = useSession()
  const { setText: setSearchText, text: searchText } = useSearchUrlQuery()
  const { org: localOrg } = useLocalInstance()
  const headerProps = useMemo<HeaderProps>(() => {
    const me: HeaderPropsIdle['me'] = session
      ? {
          myProfileHref: href(nodeId2UrlPath(session.profile.id)),
          avatar: getMaybeAssetRefUrl(session.profile.avatar) ?? '',
          name: session.profile.name,
          logout,
        }
      : null
    return {
      status: 'idle',
      me,
      homeHref: href(mainPath.landing),
      loginHref: href(mainPath.login),
      signUpHref: href(mainPath.signUp),
      organization: {
        name: localOrg.name,
        url: `//${localOrg.domain}`,
        logo: localOrg.icon,
      },
      searchText,
      setSearchText,
    }
  }, [localOrg.domain, localOrg.icon, localOrg.name, logout, searchText, session, setSearchText])
  return [headerProps]
}
