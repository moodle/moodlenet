import type { BrowserResourceListDataProps } from '@moodlenet/ed-resource/ui'
import { useResourceCardProps } from '@moodlenet/ed-resource/webapp'
import { proxyWith } from '@moodlenet/react-app/ui'
import { useMemo } from 'react'
import { useMyProfileContext } from '../../context/MyProfileContext.js'

export function useMyBookmarkedBrowserResourceListDataProps() {
  const bookmarkedResources = useMyProfileContext()?.myFeaturedEntities.all.bookmark.resource

  const resourceCardPropsList = useMemo<BrowserResourceListDataProps['resourceCardPropsList']>(
    () =>
      (bookmarkedResources ?? []).map(({ _key }) => ({
        key: _key,
        props: proxyWith(function useBrowserResourceCardPropsList() {
          const props = useResourceCardProps(_key)
          return { props }
        }),
      })),
    [bookmarkedResources],
  )

  const browserResourceListProps = useMemo<BrowserResourceListDataProps>(() => {
    const props: BrowserResourceListDataProps = {
      resourceCardPropsList,
      loadMore: null,
    }
    return props
  }, [resourceCardPropsList])

  return browserResourceListProps
}
