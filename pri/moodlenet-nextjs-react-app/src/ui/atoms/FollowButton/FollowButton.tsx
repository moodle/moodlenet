import PermIdentity from '@mui/icons-material/PermIdentity'
import Person from '@mui/icons-material/Person'

import { PrimaryButton } from '../PrimaryButton/PrimaryButton'
import { SecondaryButton } from '../SecondaryButton/SecondaryButton'
import { TertiaryButton } from '../TertiaryButton/TertiaryButton'
import './FollowButton.scss'

export type FollowButtonProps = {
  following: boolean
  disabled: boolean
  toggleFollow(): void
}

export function FollowButton({ following, toggleFollow, disabled }: FollowButtonProps) {
  return following ? (
    <SecondaryButton
      disabled={!disabled}
      onClick={toggleFollow}
      className="following-button"
      key="follow-button"
      color="orange"
    >
      Following
    </SecondaryButton>
  ) : (
    <PrimaryButton disabled={!disabled} onClick={toggleFollow} key="follow-button" className="follow-button">
      Follow
    </PrimaryButton>
  )
}
export type SmallFollowButtonProps = FollowButtonProps & { numFollowers: number }
export function SmallFollowButton({ numFollowers, following, toggleFollow, disabled }: SmallFollowButtonProps) {
  return (
    <TertiaryButton
      className={`small-follow-button ${following ? 'following' : ''} `}
      disabled={!disabled}
      onClick={toggleFollow}
      key="followers-button"
    >
      {following ? <Person /> : <PermIdentity />}
      <span>{numFollowers}</span>
    </TertiaryButton>
  )
}
