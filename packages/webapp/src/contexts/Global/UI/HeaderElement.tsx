import { Home } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { FC } from 'react'
import { webappLinkDef } from '../../../helpers/navigation'
import { PageHeader } from '../../../ui/components/PageHeader'
import { HeaderElement } from '../../../ui/context'

const homeLink = webappLinkDef<Home>('/', {})
export const HeaderElementProvider: FC = ({ children }) => {
  const Header = <PageHeader homeLink={homeLink} />
  return <HeaderElement.Provider value={Header}>{children}</HeaderElement.Provider>
}
