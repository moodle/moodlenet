import { nodeGqlId2UrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { useMemo } from 'react'
import { useLocalInstance } from '../../../../../context/Global/LocalInstance'
import { useSession } from '../../../../../context/Global/Session'
import {
  getJustAssetRefUrl,
  getMaybeAssetRefUrl,
} from '../../../../../helpers/data'
import { mainPath } from '../../../../../hooks/glob/nav'
import { href } from '../../../../elements/link'
import { CtrlHook } from '../../../../lib/ctrl'
import { useBrowserUrlQuery } from '../../../pages/Search/Ctrl/useSearchUrlQuery'
import { HeaderProps, HeaderPropsIdle } from '../Header'
const homeHref = href(mainPath.landing)
const loginHref = href(mainPath.login)
const signUpHref = href(mainPath.signUp)
const newCollectionHref = href(mainPath.createNewCollection)
const newResourceHref = href(mainPath.createNewResource)
const bookmarksHref = href(mainPath.bookmarks)

export const useHeaderCtrl: CtrlHook<HeaderProps, {}> = () => {
  const { session, logout } = useSession()
  const { setText: setSearchText, text: searchText } = useBrowserUrlQuery()
  const { org: localOrg } = useLocalInstance()

  const headerProps = useMemo<HeaderProps>(() => {
    const me: HeaderPropsIdle['me'] =
      !session ||
      (session.profile.__typename !== 'Profile' &&
        session.profile.__typename !== 'Organization')
        ? null
        : {
            ...(session.profile.__typename === 'Profile'
              ? {
                  myProfileHref: href(nodeGqlId2UrlPath(session.profile.id)),
                  avatar: getMaybeAssetRefUrl(session.profile.avatar),
                }
              : {
                  myProfileHref: homeHref,
                  avatar: getMaybeAssetRefUrl(session.profile.smallLogo),
                }),
            name: session.profile.name,
            logout,
            bookmarksHref,
            followingHref: href(mainPath.following),
            // settingsHref: href(mainPath.settings),
          }

    const headerProps: HeaderPropsIdle = {
      status: 'idle',
      me,
      homeHref,
      loginHref,
      organization: {
        name: localOrg.name,
        url: `//${localOrg.domain}`,
        logo: getJustAssetRefUrl(localOrg.logo),
        smallLogo: getJustAssetRefUrl(localOrg.smallLogo),
      },
      searchText,
      setSearchText,
      newCollectionHref,
      newResourceHref,
      signUpHref,
    }
    return headerProps
  }, [
    localOrg.domain,
    localOrg.logo,
    localOrg.name,
    localOrg.smallLogo,
    logout,
    searchText,
    session,
    setSearchText,
  ])
  return [headerProps]
}
