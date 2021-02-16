import { Home, Login } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { FC } from 'react'
import { webappLinkDef } from '../../../helpers/navigation'
import { PageHeader } from '../../../ui/components/PageHeader'
import { HeaderElement } from '../../../ui/context'

const homeLink = webappLinkDef<Home>('/', {})
const loginLink = webappLinkDef<Login>('/login', {})
export const HeaderElementProvider: FC = ({ children }) => {
  const Header = <PageHeader homeLink={homeLink} loginLink={loginLink} />
  return <HeaderElement.Provider value={Header}>{children}</HeaderElement.Provider>
}
