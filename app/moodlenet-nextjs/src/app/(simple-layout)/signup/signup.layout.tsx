import { getAccess } from '../../../lib/server/session-access'
import { layoutPropsWithChildren, slotItem, slotsMap } from '../../../lib/server/utils/slots'
import { SignupCard, SignupCardProps } from './signup.client'
import './signup.style.scss'

export default async function SignupLayout(props: layoutPropsWithChildren) {
  const access = await getAccess()
  const {
    layouts: {
      pages: { signup },
    },
  } = await access('net', 'read', 'layouts', void 0).val
  const signupCardProps: SignupCardProps = {
    signupMethods: signup.methods.map(({ label, panel }) => ({
      key: `${panel}#${label}`,
      label: slotItem(props, label),
      panel: slotItem(props, panel),
    })),
    slots: slotsMap(props, signup.slots),
  }

  return (
    <div className={`signup-page`}>
      <div className={`signup-content`}>
        <SignupCard {...signupCardProps} />
      </div>
    </div>
  )
}
