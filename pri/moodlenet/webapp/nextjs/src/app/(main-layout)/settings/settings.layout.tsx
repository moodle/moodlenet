import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import { getAuthenticatedUserSession } from '../../../lib/server/session-access'
import { srvSiteUrls } from '../../../lib/server/utils/site-urls.server'
import { layoutPropsWithChildren } from '../../../lib/server/utils/slots'
import { SettingsMenu } from './settings.client'
import './settings.style.scss'
export default async function SettingsLayout(props: layoutPropsWithChildren) {
  const authenticatedUserSession = await getAuthenticatedUserSession()
  if (!authenticatedUserSession) {
    const pagesUrls = (await srvSiteUrls()).site.pages
    const loginUrl = pagesUrls.access.login({
      redirect: headers().get('x-path') ?? pagesUrls.landing,
    })
    redirect(loginUrl, RedirectType.replace)
  }
  return (
    <div className={`user-settings`}>
      <div className="menu-container" role="navigation">
        <SettingsMenu />
      </div>

      <div className="content">{props.children}</div>
    </div>
  )
}
