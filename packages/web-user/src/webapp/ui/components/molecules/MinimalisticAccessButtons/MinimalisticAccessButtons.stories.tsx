import { AddonItem, PrimaryButton } from '@moodlenet/component-library'
import { Href } from '@moodlenet/react-app/common'

import { ReactElement } from 'react'
import { LoginButtonMini, SignupButtonMini } from './MinimalisticAccessButtons.js'
import './MinimalisticAccessButtons.scss'

export type MinimalisticHeaderProps = {
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

export const getAccesMinimalisticHeaderItems = (
  props: MinimalisticHeaderProps,
): MinimalisticSlots => {
  const { showLearnMoreButton, showLoginButton, showSignupButton, loginHref, signupHref } = props

  const rightButtons = [
    showSignupButton ? <SignupButtonMini signupHref={signupHref} /> : null,
    showLoginButton ? <LoginButtonMini loginHref={loginHref} /> : null,
    showLearnMoreButton ? (
      <a href="https://moodle.com/moodlenet/" target="__blank">
        <PrimaryButton color="grey">
          {/* <Trans> */}
          Learn more
          {/* </Trans> */}
        </PrimaryButton>
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
