import { sessionContext } from '#lib/server/sessionContext'
import { layoutPropsWithChildren, slotItem, slotsMap } from '#lib/server/utils/slots'
import { SignupCard, SignupCardProps } from './signup.client'
import './signup.style.scss'

export default async function SignupLayout(props: layoutPropsWithChildren) {
  const { website } = await sessionContext()
  const layout = await website.layouts.pages('signup')
  const signupCardProps: SignupCardProps = {
    signupMethods: layout.methods.map(({ label, panel }) => ({
      key: `${panel}#${label}`,
      label: slotItem(props, label),
      panel: slotItem(props, panel),
    })),
    slots: slotsMap(props, layout.slots),
  }

  return (
    <div className={`signup-page`}>
      <div className={`signup-content`}>
        <SignupCard {...signupCardProps} />
      </div>
    </div>
  )
}
