// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useContext, useMemo, useState } from 'react'
import { AuthCtx } from '../../../../context/AuthContext.js'
import { shell } from '../../../../shell.mjs'
import type { BookmarkButtonProps } from './BookmarkButton.js'

export const useBookmarkButtonProps = ({
  profileKey,
}: {
  profileKey: string
}): BookmarkButtonProps | null => {
  const { isAuthenticated } = useContext(AuthCtx)
  const [bookmarked, setBookmarked] = useState(false)
  const props = useMemo(() => {
    //  if (!pageProgs) return null
    const toggleBookmark = () => {
      shell.rpc.me[
        'webapp/feature-entity/:action(add|remove)/:feature(bookmark|follow|like)/:entity_id'
      ](undefined, { action: `add`, feature: 'bookmark', entity_id: profileKey }).then(() =>
        setBookmarked(!bookmarked),
      )
    }
    const props: BookmarkButtonProps = {
      bookmarked,
      canBookmark: true,
      isAuthenticated,
      toggleBookmark,
    }

    return props
  }, [bookmarked, isAuthenticated, profileKey])

  return props
}
