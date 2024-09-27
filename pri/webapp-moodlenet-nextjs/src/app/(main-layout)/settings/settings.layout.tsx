import { getAuthenticatedUserSessionOrRedirectToLogin } from '../../../lib/server/session-access'
import { layoutPropsWithChildren } from '../../../lib/server/utils/slots'
import { SettingsMenu } from './settings.client'
import './settings.style.scss'
export default async function SettingsLayout(props: layoutPropsWithChildren) {
  await getAuthenticatedUserSessionOrRedirectToLogin()

  return (
    <div className="user-settings">
      <div className="menu-container" role="navigation">
        <SettingsMenu />
      </div>

      <div className="content">{props.children}</div>
    </div>
  )
}
