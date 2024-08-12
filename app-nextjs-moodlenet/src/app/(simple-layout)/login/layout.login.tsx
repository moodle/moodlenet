import { sessionContext } from '@/lib-server/sessionContext'
import { layoutProps, slotItem } from '@/lib-server/utils/slots'
import { LoginCard, LoginCardProps } from './client.login'
import './layout.login.scss'

export default async function LoginLayout(props: layoutProps) {
  const { website } = await sessionContext()
  const layout = await website.layouts.pages('login')
  const loginCardProps: LoginCardProps = {
    loginMethods: layout.methods.map(({ label, item }) => ({
      label,
      key: item,
      panel:
        slotItem(props, item) ??
        'NO PANEL should never happen as it comes from injected parallel routes',
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
