import { SignupCard, SignupCardProps } from './signup.client'
import './signup.style.scss'

export default async function SignupLayout(/* props: layoutPropsWithChildren */) {
  // const { signupPageLayout } = await client.proxy.moodlenetReactApp.props.signupPage()

  // const signupCardProps: SignupCardProps = {
  //   signupMethods: signupPageLayout.methods.map(({ label, panel }) => ({
  //     key: `${panel}#${label}`,
  //     label: slotItem(props, label),
  //     panel: slotItem(props, panel),
  //   })),
  //   slots: slotsMap(props, signupPageLayout.slots),
  // }
  const signupCardProps: SignupCardProps = { signupMethods: [], slots: { subCard: [] } }

  return (
    <div className={`signup-page`}>
      <div className={`signup-content`}>
        <SignupCard {...signupCardProps} />
      </div>
    </div>
  )
}
