// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useMemo } from 'react'
import { useProfileProps } from '../../pages/Profile/ProfileHooks.js'
import type { BookmarkButtonProps } from './BookmarkButton.js'

export const useBookmarkButtonProps = ({
  profileKey,
}: {
  profileKey: string
}): BookmarkButtonProps | null => {
  const pageProgs = useProfileProps({ profileKey })

  const props = useMemo(() => {
    if (!pageProgs) return null
    const {
      actions: { toggleFollow },
      access: { canBookmark, isAuthenticated },
    } = pageProgs

    const props: BookmarkButtonProps = {
      bookmarked: true,
      canBookmark,
      isAuthenticated,
      toggleBookmark: toggleFollow,
    }

    return props
  }, [pageProgs])

  return props
}
