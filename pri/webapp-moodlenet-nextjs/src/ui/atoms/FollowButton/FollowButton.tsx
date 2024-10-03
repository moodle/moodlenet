import PermIdentity from '@mui/icons-material/PermIdentity'
import Person from '@mui/icons-material/Person'

import { flags } from '@moodle/lib-types'
import { PrimaryButton } from '../PrimaryButton/PrimaryButton'
import { SecondaryButton } from '../SecondaryButton/SecondaryButton'
import { TertiaryButton } from '../TertiaryButton/TertiaryButton'
import './FollowButton.scss'

export type FollowButtonProps = {
  is: flags<'followed'>
  can: flags<'un_follow'>
  toggleFollow: () => void
}

export function FollowButton({ can, is, toggleFollow }: FollowButtonProps) {
  return is.followed ? (
    <SecondaryButton
      disabled={!can.un_follow}
      onClick={toggleFollow}
      className="following-button"
      key="follow-button"
      color="orange"
    >
      Following
    </SecondaryButton>
  ) : (
    <PrimaryButton
      disabled={!can.un_follow}
      onClick={toggleFollow}
      key="follow-button"
      className="follow-button"
    >
      Follow
    </PrimaryButton>
  )
}
export type SmallFollowButtonProps = FollowButtonProps & { numFollowers: number }
export function SmallFollowButton({ numFollowers, can, is, toggleFollow }: SmallFollowButtonProps) {
  return (
    <TertiaryButton
      className={`small-follow-button ${is.followed ? 'followed' : ''} `}
      disabled={!can.un_follow}
      onClick={toggleFollow}
      key="followers-button"
    >
      {is.followed ? <Person /> : <PermIdentity />}
      <span>{numFollowers}</span>
    </TertiaryButton>
  )
}
