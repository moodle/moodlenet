import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import { getAdminUserSession } from '../../../lib/server/session-access'
import { srvSiteUrls } from '../../../lib/server/utils/site-urls.server'
import { layoutPropsWithChildren } from '../../../lib/server/utils/slots'
import './admin.style.scss'
import { AdminSettingsMenu } from './admin.client'

export default async function AdminLayout(props: layoutPropsWithChildren) {
  const adminUserSession = await getAdminUserSession()
  if (!adminUserSession) {
    const pagesUrls = (await srvSiteUrls()).site.pages
    const loginUrl = pagesUrls.access.login({
      redirect: headers().get('x-path') ?? pagesUrls.landing,
    })
    redirect(loginUrl, RedirectType.replace)
  }

  return (
    <div className={`admin-settings`}>
      <div className="menu-container" role="navigation">
        <AdminSettingsMenu />
      </div>

      <div className="content">{props.children}</div>
    </div>
  )
}
