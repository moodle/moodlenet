import { AddonItem, PrimaryButton, SecondaryButton } from '@moodlenet/component-library'
import { Href } from '@moodlenet/react-app/common'
import { Link } from '@moodlenet/react-app/ui'

import { ReactElement } from 'react'
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
    showSignupButton ? (
      <Link href={signupHref}>
        {/* // TODO //@ETTO Implement on Controller */}
        <SecondaryButton className={`${showLoginButton ? 'visible' : ''}`} color="orange">
          {/* <Trans> */}
          Sign up
          {/* </Trans> */}
        </SecondaryButton>
      </Link>
    ) : null,
    showLoginButton ? (
      <Link href={loginHref}>
        {/* TODO //@ETTO Implement on Controller */}
        {showSignupButton ? (
          <PrimaryButton>
            {/* <Trans> */}
            Main login
            {/* </Trans> */}
          </PrimaryButton>
        ) : (
          <SecondaryButton color="orange">
            {/* <Trans> */}
            Log in
            {/* </Trans> */}
          </SecondaryButton>
        )}
      </Link>
    ) : null,
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
