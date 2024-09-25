import { PrimaryButton, SecondaryButton, TertiaryButton } from '@moodlenet/component-library'
import { PermIdentity, Person } from '@mui/icons-material'
import type { FC } from 'react'
import './FollowButton.scss'

export type FollowButtonProps = {
  followed: boolean
  canFollow: boolean
  isCreator: boolean
  isAuthenticated: boolean
  toggleFollow: () => void
}

export const FollowButton: FC<FollowButtonProps> = ({
  followed,
  canFollow,
  isCreator,
  isAuthenticated,
  toggleFollow,
}) => {
  return followed && !isCreator ? (
    <SecondaryButton
      disabled={!canFollow}
      onClick={toggleFollow}
      className="following-button"
      key="follow-button"
      color="orange"
    >
      Following
    </SecondaryButton>
  ) : (
    <PrimaryButton
      disabled={!canFollow || !isAuthenticated || isCreator}
      onClick={toggleFollow}
      key="follow-button"
      className="follow-button"
      abbr={
        isCreator
          ? 'Creators cannot follow their own content'
          : !isAuthenticated
            ? 'Login or signup to follow'
            : followed
              ? 'Unfollow user'
              : 'Follow user'
      }
    >
      Follow
    </PrimaryButton>
  )
}
export type SmallFollowButtonProps = FollowButtonProps & { numFollowers: number }
export const SmallFollowButton: FC<SmallFollowButtonProps> = ({
  numFollowers,
  followed,
  canFollow,
  isCreator,
  isAuthenticated,
  toggleFollow,
}) => {
  return (
    <TertiaryButton
      className={`small-follow-button ${followed ? 'followed' : ''} `}
      disabled={!canFollow || isCreator}
      onClick={canFollow ? toggleFollow : () => undefined}
      abbr={
        isCreator
          ? `${numFollowers} follower${numFollowers === 1 ? '' : 's'}`
          : !isAuthenticated
            ? 'Login or signup to follow'
            : followed
              ? 'Unfollow'
              : 'Follow'
      }
      key="followers-button"
    >
      {followed ? <Person /> : <PermIdentity />}
      <span>{numFollowers}</span>
    </TertiaryButton>
  )
}
