import { getAdminUserSessionOrRedirect } from '../../../lib/server/session-access'
import { layoutPropsWithChildren } from '../../../lib/server/utils/slots'
import { AdminMenu } from './admin.client'
import './admin.style.scss'

export default async function AdminLayout(props: layoutPropsWithChildren) {
  await getAdminUserSessionOrRedirect()

  return (
    <div className="admin-settings">
      <div className="menu-container" role="navigation">
        <AdminMenu />
      </div>

      <div className="content">{props.children}</div>
    </div>
  )
}
