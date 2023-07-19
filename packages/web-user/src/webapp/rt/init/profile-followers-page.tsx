import type { BrowserMainColumnItemBase } from '@moodlenet/react-app/ui'
import { BrowserProfileList } from '@moodlenet/web-user/ui'
import { useMemo } from 'react'
import { useProfileFollowersBrowserProfileListDataProps } from '../page/profile-followers/ProfileFollowersBrowserProfileListHook.mjs'
import { ProfileFollowersPagePlugin } from '../page/profile-followers/ProfileFollowersPageHook.mjs'

ProfileFollowersPagePlugin.register(({ profileKey }) => {
  return useMemo(() => {
    return {
      browserItems_mainColumnItems: {
        profiles: { Item: BrowserProfileListItem, filters: [], name: 'People' },
      },
    }
    function BrowserProfileListItem(browserMainColumnItemBase: BrowserMainColumnItemBase) {
      return (
        <BrowserProfileList
          {...useProfileFollowersBrowserProfileListDataProps({ profileKey })}
          {...browserMainColumnItemBase}
        />
      )
    }
  }, [profileKey])
})
