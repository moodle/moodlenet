// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useContext, useMemo } from 'react'
import type { KnownEntityType } from '../../../common/types.mjs'
import type { BookmarkButtonProps } from '../../ui/exports/ui.mjs'
import { AuthCtx } from '../context/AuthContext'
import { useMyFeaturedEntity } from '../context/useMyFeaturedEntity'

export const useBookmarkButtonProps = ({
  _key,
  entityType,
}: {
  _key: string
  entityType: KnownEntityType
}): BookmarkButtonProps | null => {
  const { isAuthenticated } = useContext(AuthCtx)
  const { isFeatured, toggle } = useMyFeaturedEntity({ _key, entityType, feature: 'bookmark' })
  const props = useMemo(() => {
    //  if (!pageProgs) return null
    const toggleBookmark = toggle
    const props: BookmarkButtonProps = {
      bookmarked: isFeatured,
      canBookmark: true,
      isAuthenticated,
      toggleBookmark,
    }

    return props
  }, [isAuthenticated, isFeatured, toggle])

  return props
}
