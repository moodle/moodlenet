import { PrimaryButton, type AddonItem } from '@moodlenet/component-library'
import type { Href } from '@moodlenet/react-app/common'
import { LoginButtonMini, SignupButtonMini } from './MinimalisticAccessButtons.js'

export function getMiniAccessButtonsHeaderItems({
  loginHref,
  signupHref,
}: {
  loginHref: Href
  signupHref: Href
}): AddonItem {
  const miniAccessButtons = [
    <SignupButtonMini key="SignupButtonMini" signupHref={signupHref} />,
    <LoginButtonMini key="LoginButtonMini" loginHref={loginHref} />,
    <a href="https://moodle.org/mod/forum/view.php?id=8726" target="__blank" key="Learn more">
      <PrimaryButton color="grey">Learn more</PrimaryButton>
    </a>,
  ]
  const miniAccessButtonsAddon: AddonItem = {
    Item: () => <div className="minimalistic-access-buttons">{miniAccessButtons}</div>,
    key: '"access-buttons',
  }

  return miniAccessButtonsAddon
}
