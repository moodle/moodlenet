import { sessionContext } from '@/lib/server/sessionContext'
import { layoutPropsWithChildren, slotItem, slots } from '@/lib/server/utils/slots'
import { SignupCard, SignupCardProps } from './signup.client'
import './signup.style.scss'

export default async function SignupLayout(props: layoutPropsWithChildren) {
  const { website } = await sessionContext()
  const layout = await website.layouts.pages('signup')
  const signupCardProps: SignupCardProps = {
    signupMethods: layout.methods.map(({ label, item }) => ({
      key: item,
      label,
      panel: slotItem(props, item),
    })),
    slots: slots(props, layout.slots),
  }

  return (
    <div className={`signup-page`}>
      <div className={`signup-content`}>
        <SignupCard {...signupCardProps} />
      </div>
    </div>
  )
}
