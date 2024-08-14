import { sessionContext } from '@/lib/server/sessionContext'
import { layoutPropsWithChildren, slotItem } from '@/lib/server/utils/slots'
import { LoginCard, LoginCardProps } from './login.client'
import './login.style.scss'

export default async function LoginLayout(props: layoutPropsWithChildren) {
  const { website } = await sessionContext()
  const layout = await website.layouts.pages('login')
  const loginCardProps: LoginCardProps = {
    loginMethods: layout.methods.map(({ label, item }) => ({
      key: item,
      label,
      panel: slotItem(props, item),
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
