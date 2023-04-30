import { TertiaryButton } from '@moodlenet/component-library'
import { Bookmark, BookmarkBorder } from '@mui/icons-material'
import { FC } from 'react'
import './BookmarkButton.scss'

export type BookmarkButtonProps = {
  bookmarked: boolean
  canBookmark: boolean
  isAuthenticated: boolean
  toggleBookmark: () => void
  color?: 'white' | 'grey'
}

export const BookmarkButton: FC<BookmarkButtonProps> = ({
  bookmarked,
  canBookmark,
  isAuthenticated,

  toggleBookmark,
  color,
}) => {
  return (
    <TertiaryButton
      className={`bookmark-button ${bookmarked ? 'bookmarked' : ''} ${color}`}
      disabled={!canBookmark || !isAuthenticated}
      onClick={canBookmark ? toggleBookmark : () => undefined}
      abbr={
        !isAuthenticated
          ? 'Login or signup to bookmark'
          : bookmarked
          ? 'Remove bookmark'
          : 'Bookmark'
      }
      key="bookmark-button"
    >
      {bookmarked ? <Bookmark /> : <BookmarkBorder />}
    </TertiaryButton>
  )
}

BookmarkButton.defaultProps = {
  color: 'grey',
}
