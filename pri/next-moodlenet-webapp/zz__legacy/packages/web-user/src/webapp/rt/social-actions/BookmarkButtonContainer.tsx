import type { FC } from 'react'
import type { KnownEntityType } from '../../../common/types.mjs'
import { BookmarkButton } from '../../ui/components/atoms/BookmarkButton/BookmarkButton'
import { useBookmarkButtonProps } from './BookmarkButtonHook'

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
