import { TertiaryButton } from '@moodlenet/component-library'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import type { FC } from 'react'
import './LikeButton.scss'

export type LikeButtonProps = LikeButtonPropsData & LikeButtonPropsUI

export type LikeButtonPropsData = {
  liked: boolean
  canLike: boolean
  numLikes: number
  isCreator?: boolean
  isAuthenticated: boolean
  toggleLike: () => void
}

type LikeButtonPropsUI = {
  color?: 'white' | 'grey'
}

export const LikeButton: FC<LikeButtonProps> = ({
  numLikes,
  liked,
  canLike,
  isCreator,
  isAuthenticated,
  toggleLike,
  color,
}) => {
  return (
    <TertiaryButton
      className={`like-button ${liked ? 'liked' : ''} ${color}`}
      disabled={!canLike || !isAuthenticated || isCreator}
      onClick={canLike ? toggleLike : () => undefined}
      abbr={
        isCreator
          ? 'Creators cannot like their own content'
          : !isAuthenticated
          ? 'Login or signup to like'
          : liked
          ? 'Remove like'
          : 'Like'
      }
      key="like-button"
    >
      {liked ? <Favorite /> : <FavoriteBorder />}
      <span>{numLikes}</span>
    </TertiaryButton>
  )
}

LikeButton.defaultProps = {
  color: 'grey',
}
