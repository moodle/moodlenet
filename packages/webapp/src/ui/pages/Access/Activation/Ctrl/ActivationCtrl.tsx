import { useMemo } from 'react'
import { mainPath, useRedirectProfileHomeIfLoggedIn } from '../../../../../hooks/glob/nav'
import { href } from '../../../../elements/link'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { useAccessHeaderCtrl } from '../../AccessHeader/Ctrl/AccessHeaderCtrl'
import { ActivationProps } from '../Activation'
const loginHref = href(mainPath.login)

export const useActivationCtrl: CtrlHook<ActivationProps, {}> = () => {
  useRedirectProfileHomeIfLoggedIn({ delay: 618 })
  const activationProps = useMemo<ActivationProps>(() => {
    const activationProps: ActivationProps = {
      accessHeaderProps: ctrlHook(useAccessHeaderCtrl, {}, 'Activate User Access Header'),
      loginHref,
    }
    return activationProps
  }, [])

  return activationProps && [activationProps]
}
