import { Bookmarks } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import { useBookmarksPageProps } from './BookmarksPageHook.mjs'

export const BookmarksPageContainer: FC = () => {
  const bookmarksPageProps = useBookmarksPageProps()
  return <Bookmarks {...bookmarksPageProps} />
}
