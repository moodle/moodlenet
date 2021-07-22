import { parseNodeId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
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
  const { session, logout, currentProfile } = useSession()
  const { setText: setSearchText, text: searchText } = useSearchUrlQuery()
  const { org: localOrg } = useLocalInstance()
  const headerProps = useMemo<HeaderProps>(() => {
    const me: HeaderPropsIdle['me'] =
      currentProfile && session
        ? {
            myProfileHref: href(`/profile/${parseNodeId(currentProfile.id)._key}`), //FIXME: make it less eror prone
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
      organization: {
        name: localOrg.name,
        url: `//${localOrg.domain}`,
        logo: localOrg.icon,
      },
      searchText,
      setSearchText,
    }
  }, [currentProfile, localOrg.domain, localOrg.icon, localOrg.name, logout, searchText, session, setSearchText])
  return [headerProps]
}
