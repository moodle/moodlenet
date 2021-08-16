import { useMemo } from 'react'
import { useLocalInstance } from '../../../../../context/Global/LocalInstance'
import { mainPath, useRedirectHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { href } from '../../../../elements/link'
import { CtrlHook } from '../../../../lib/ctrl'
import { AccessHeaderProps } from '../AccessHeader'
const homeHref = href(mainPath.landing)
const termsAndConditionsHref = href(mainPath.termsAndConditionsHref)

export const useAccessHeaderCtrl: CtrlHook<AccessHeaderProps, {}, 'page'> = () => {
  useRedirectHomeIfLoggedIn()
  const { org } = useLocalInstance()

  const accessHeaderProps = useMemo(() => {
    const accessHeaderProps: Omit<AccessHeaderProps, 'page'> = {
      homeHref,
      termsAndConditionsHref,
      organization: {
        logo: org.icon,
        name: org.name,
        url: `//${org.domain}`,
      },
    }
    return accessHeaderProps
  }, [org.domain, org.icon, org.name])

  return [accessHeaderProps]
}
