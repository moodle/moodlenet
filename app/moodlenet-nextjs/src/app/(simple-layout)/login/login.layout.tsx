import { getAccess } from '../../../lib/server/session-access'
import { layoutPropsWithChildren, slotItem } from '../../../lib/server/utils/slots'
import { LoginCard, LoginCardProps } from './login.client'
import './login.style.scss'

export default async function LoginLayout(props: layoutPropsWithChildren) {
  const access = await getAccess()
  const {
    layouts: {
      pages: { login },
    },
  } = await access('net', 'read', 'layouts', void 0).val
  const loginCardProps: LoginCardProps = {
    loginMethods: login.methods.map(({ label, panel }) => ({
      key: `${panel}#${label}`,
      label: slotItem(props, label),
      panel: slotItem(props, panel),
    })),
  }

  return (
    <div className="login-page">
      <div className="content">
        <LoginCard {...loginCardProps} />
      </div>
    </div>
  )
}
