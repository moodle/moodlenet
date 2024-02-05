import type { AddonItem } from '@moodlenet/component-library'
import { PrimaryButton } from '@moodlenet/component-library'
import type { Href } from '@moodlenet/react-app/common'

import type { ReactElement } from 'react'
import { LoginButtonMini, SignupButtonMini } from './MinimalisticAccessButtons.js'
import './MinimalisticAccessButtons.scss'

export type MinimalisticAccessHeaderProps = {
  showLoginButton: boolean
  showSignupButton: boolean
  showLearnMoreButton: boolean
  signupHref: Href
  loginHref: Href
}
export type MinimalisticSlots = {
  leftItems: AddonItem[]
  centerItems: AddonItem[]
  rightItems: AddonItem[]
}

export const getMinimalisticAccessHeaderItems = (
  props: MinimalisticAccessHeaderProps,
): MinimalisticSlots => {
  const { showLearnMoreButton, showLoginButton, showSignupButton, loginHref, signupHref } = props

  const rightButtons = [
    showSignupButton ? <SignupButtonMini signupHref={signupHref} /> : null,
    showLoginButton ? <LoginButtonMini loginHref={loginHref} /> : null,
    showLearnMoreButton ? (
      <a href="https://moodle.org/mod/forum/view.php?id=8726" target="__blank">
        <PrimaryButton color="grey">Learn more</PrimaryButton>
      </a>
    ) : null,
  ].filter((item): item is ReactElement => !!item)

  const updatedRightButtons: AddonItem[] =
    rightButtons.length > 0
      ? [
          {
            Item: () => <div className="minimalistic-access-buttons">{rightButtons}</div>,
            key: '"access-buttons',
          },
        ]
      : []

  return {
    leftItems: [],
    centerItems: [],
    rightItems: [...updatedRightButtons],
  }
}
