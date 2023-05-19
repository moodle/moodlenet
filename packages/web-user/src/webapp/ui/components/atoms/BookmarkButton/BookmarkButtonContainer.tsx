import type { FC } from 'react'
import { BookmarkButton } from './BookmarkButton.js'
import { useBookmarkButtonProps } from './BookmarkButtonHook.js'

export const BookmarkButtonContainer: FC<{ profileKey: string }> = ({ profileKey }) => {
  const panelProps = useBookmarkButtonProps({ profileKey })
  if (!panelProps) {
    return null
  }
  return <BookmarkButton {...panelProps} />
}
