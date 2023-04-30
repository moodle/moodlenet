import { TertiaryButton } from '@moodlenet/component-library'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { FC } from 'react'
import './LikeButton.scss'

export type LikeButtonProps = {
  liked: boolean
  canLike: boolean
  isCreator: boolean
  isAuthenticated: boolean
  toggleLike: () => void
  color?: 'white' | 'grey'
}

export const LikeButton: FC<LikeButtonProps & { numLikes: number }> = ({
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
