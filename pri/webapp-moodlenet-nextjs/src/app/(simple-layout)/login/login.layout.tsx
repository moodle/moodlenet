import { priAccess } from '../../../lib/server/session-access'
import { layoutPropsWithChildren, slotItem } from '../../../lib/server/utils/slots'
import { LoginCard, LoginCardProps } from './login.client'
import './login.style.scss'

export default async function LoginLayout(props: layoutPropsWithChildren) {
  const {
    pages: { login },
  } = await priAccess().moodle.netWebappNextjs.v1_0.pri.webapp.layouts()

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
