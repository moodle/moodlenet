import { useMemo } from 'react'
import { useLocalInstance } from '../../../../../context/Global/LocalInstance'
import { useRedirectHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { href } from '../../../../elements/link'
import { CtrlHook } from '../../../../lib/ctrl'
import { AccessHeaderProps } from '../AccessHeader'

export const useAccessHeaderCtrl: CtrlHook<AccessHeaderProps, {}, 'page'> = () => {
  useRedirectHomeIfLoggedIn()
  const { org } = useLocalInstance()

  const accessHeaderProps = useMemo(() => {
    const accessHeaderProps: Omit<AccessHeaderProps, 'page'> = {
      homeHref: href('Landing/Logged In'),
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
