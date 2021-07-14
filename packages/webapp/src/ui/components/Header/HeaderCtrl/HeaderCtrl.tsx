import { useMemo } from 'react'
import { useSession } from '../../../../context/Global/Session'
import { mainPath } from '../../../../hooks/glob/nav'
import { href } from '../../../elements/link'
import { createWithProps } from '../../../lib/ctrl'
import { HeaderProps, HeaderPropsIdle } from '../Header'

export const [HeaderCtrl, headerCtrlWithProps] = createWithProps<HeaderProps, {}>(props => {
  const { session, logout } = useSession()
  const { __uiComp: HeaderUI } = props

  const headerProps = useMemo<HeaderProps>(() => {
    const { __key, __uiComp, ...rest } = props
    const me: HeaderPropsIdle['me'] = session
      ? {
          avatar: session.username,
          username: session.username,
          logout,
        }
      : null
    return {
      status: 'idle',
      ...rest,
      me,
      homeHref: href(mainPath.landing),
      loginHref: href(mainPath.login),
      organization: {
        name: 'BFH',
        url: 'https://www.bfh.ch/',
        logo: 'https://www.bfh.ch/dam/jcr:eaa68853-a1f9-4198-a2a5-e19eae244092/bfh-logo.svg',
      },
    }
  }, [logout, props, session])
  return <HeaderUI {...headerProps} />
})
