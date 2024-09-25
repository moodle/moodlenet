import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import { getAdminUserSession } from '../../../lib/server/session-access'
import { srvSiteUrls } from '../../../lib/server/utils/site-urls.server'
import { layoutPropsWithChildren } from '../../../lib/server/utils/slots'
import './admin.style.scss'

export default async function AdminLayout(props: layoutPropsWithChildren) {
  const adminUserSession = await getAdminUserSession()
  if (!adminUserSession) {
    const pagesUrls = (await srvSiteUrls()).site.pages
    const loginUrl = pagesUrls.access.login({
      redirect: headers().get('x-path') ?? pagesUrls.landing,
    })
    redirect(loginUrl, RedirectType.replace)
  }

  return props.children
}
