// import { AuthCtx } from '@moodlenet/web-user/webapp'
import { useContext, useMemo } from 'react'
import { AuthCtx } from '../../../../context/AuthContext.js'
import { shell } from '../../../../shell.mjs'
import type { BookmarkButtonProps } from './BookmarkButton.js'

const getVoid = () => {
  return
}

export const useBookmarkButtonProps = ({
  profileKey,
}: {
  profileKey: string
}): BookmarkButtonProps | null => {
  const { isAuthenticated } = useContext(AuthCtx)

  const props = useMemo(() => {
    //  if (!pageProgs) return null
    const toggleBookmark = () => {
      shell.rpc.me[
        'webapp/feature-entity/:action(add|remove)/:feature(bookmark|follow|like)/:entity_id'
      ](getVoid(), { action: `add`, feature: 'bookmark', entity_id: profileKey })
    }
    const props: BookmarkButtonProps = {
      bookmarked: true,
      canBookmark: true,
      isAuthenticated,
      toggleBookmark,
    }

    return props
  }, [isAuthenticated, profileKey])

  return props
}
