import type { FC } from 'react'
import type { KnownEntityType } from '../../../../../common/types.mjs'
import { BookmarkButton } from './BookmarkButton.js'
import { useBookmarkButtonProps } from './BookmarkButtonHook.js'

export const BookmarkButtonContainer: FC<{
  _key: string
  entityType: KnownEntityType
}> = ({ _key, entityType }) => {
  const bookmarkButtonProps = useBookmarkButtonProps({ _key, entityType })
  if (!bookmarkButtonProps) {
    return null
  }
  return <BookmarkButton {...bookmarkButtonProps} />
}
