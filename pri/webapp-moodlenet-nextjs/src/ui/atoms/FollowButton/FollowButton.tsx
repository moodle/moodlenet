import PermIdentity from '@mui/icons-material/PermIdentity'
import Person from '@mui/icons-material/Person'

import { flags } from '@moodle/lib-types'
import { PrimaryButton } from '../PrimaryButton/PrimaryButton'
import { SecondaryButton } from '../SecondaryButton/SecondaryButton'
import { TertiaryButton } from '../TertiaryButton/TertiaryButton'
import './FollowButton.scss'

export type FollowButtonProps = {
  followed: boolean
  toggleFollow?: undefined | (() => void)
}

export function FollowButton({ followed, toggleFollow }: FollowButtonProps) {
  return followed ? (
    <SecondaryButton
      disabled={!!toggleFollow}
      onClick={toggleFollow}
      className="following-button"
      key="follow-button"
      color="orange"
    >
      Following
    </SecondaryButton>
  ) : (
    <PrimaryButton
      disabled={!!toggleFollow}
      onClick={toggleFollow}
      key="follow-button"
      className="follow-button"
    >
      Follow
    </PrimaryButton>
  )
}
export type SmallFollowButtonProps = FollowButtonProps & { numFollowers: number }
export function SmallFollowButton({
  numFollowers,
  followed,
  toggleFollow,
}: SmallFollowButtonProps) {
  return (
    <TertiaryButton
      className={`small-follow-button ${followed ? 'followed' : ''} `}
      disabled={!!toggleFollow}
      onClick={toggleFollow}
      key="followers-button"
    >
      {followed ? <Person /> : <PermIdentity />}
      <span>{numFollowers}</span>
    </TertiaryButton>
  )
}
