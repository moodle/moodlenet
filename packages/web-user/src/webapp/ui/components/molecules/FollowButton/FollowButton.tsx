import { PermIdentity } from '@material-ui/icons'
import { PrimaryButton, SecondaryButton, TertiaryButton } from '@moodlenet/component-library'
import { Person } from '@mui/icons-material'
import { FC } from 'react'

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
  return followed ? (
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
      disabled={!canFollow || !isAuthenticated}
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

export const SmallFollowButton: FC<FollowButtonProps & { numFollowers: number }> = ({
  numFollowers,
  followed,
  canFollow,
  isCreator,
  isAuthenticated,
  toggleFollow,
}) => {
  return (
    <TertiaryButton
      className={`follow ${followed ? 'followed' : ''}`}
      disabled={!canFollow || isCreator}
      onClick={canFollow ? toggleFollow : () => undefined}
      abbr={
        isCreator
          ? 'Creators cannot follow their own content'
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
