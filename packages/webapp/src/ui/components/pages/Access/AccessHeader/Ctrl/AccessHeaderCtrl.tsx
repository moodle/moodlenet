import { useMemo } from 'react'
import { useLocalInstance } from '../../../../../../context/Global/LocalInstance'
import { getJustAssetRefUrl } from '../../../../../../helpers/data'
import {
  mainPath,
  useRedirectHomeIfLoggedIn,
} from '../../../../../../hooks/glob/nav'
import { href } from '../../../../../elements/link'
import { CtrlHook } from '../../../../../lib/ctrl'
import { AccessHeaderProps } from '../AccessHeader'
const homeHref = href(mainPath.landing)
const signupHref = href(mainPath.signUp)
const loginHref = href(mainPath.login)

export const useAccessHeaderCtrl: CtrlHook<
  AccessHeaderProps,
  {},
  'page'
> = () => {
  useRedirectHomeIfLoggedIn()
  const { org } = useLocalInstance()

  const accessHeaderProps = useMemo(() => {
    const accessHeaderProps: Omit<AccessHeaderProps, 'page'> = {
      homeHref,
      loginHref,
      signupHref,
      organization: {
        logo: getJustAssetRefUrl(org.logo),
        smallLogo: getJustAssetRefUrl(org.smallLogo),
        url: `//${org.domain}`,
      },
    }
    return accessHeaderProps
  }, [org.domain, org.logo, org.smallLogo])

  return [accessHeaderProps]
}
