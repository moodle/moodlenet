import { BrowserCollectionList } from '@moodlenet/collection/ui'
import type { BrowserMainColumnItemBase } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import { useMyBookmarkedBrowserCollectionListProps } from './MyBookmarkedBrowserCollectionListHook.mjs'

export const MyBookmarkedBrowserCollectionListContainer: FC<
  BrowserMainColumnItemBase
> = browserMainColumnItemBase => {
  const browserCollectionListProps =
    useMyBookmarkedBrowserCollectionListProps(browserMainColumnItemBase)
  return <BrowserCollectionList {...browserCollectionListProps} />
}
