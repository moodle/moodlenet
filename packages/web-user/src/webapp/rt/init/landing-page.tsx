import { LandingCollectionList } from '@moodlenet/collection/ui'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { LandingResourceList } from '@moodlenet/ed-resource/ui'
import { href } from '@moodlenet/react-app/common'
import type { LandingPlugin } from '@moodlenet/react-app/webapp'
import { LandingHookPlugin } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import { SETTINGS_PAGE_ROUTE_PATH } from '../../../common/webapp-routes.mjs'
import type { InterestInfoProps } from '../../ui/exports/ui.mjs'
import { InterestInfo, LandingProfileList } from '../../ui/exports/ui.mjs'
import { useMyProfileContext } from '../exports.mjs'
import { useMyLandingPageCollectionListDataProps } from '../page/my-landing-page/MyLandingPageCollectionListHook.mjs'
import { useMyLandingPageProfileListDataProps } from '../page/my-landing-page/MyLandingPageProfileListHook.mjs'
import { useMyLandingPageResourceListDataProps } from '../page/my-landing-page/MyLandingPageResourceListHook.mjs'

const promptSetInterestsBanner: AddonItemNoKey = {
  Item: () => {
    const myProfileContext = useMyProfileContext()
    const interestInfoProps = useMemo<InterestInfoProps | null>(() => {
      if (!myProfileContext) {
        return null
      }
      const props: InterestInfoProps = {
        doNotShowAgain() {
          myProfileContext.myInterests.save('empty')
        },
        userSettingHref: href(SETTINGS_PAGE_ROUTE_PATH),
      }
      return props
    }, [myProfileContext])
    return interestInfoProps && <InterestInfo {...interestInfoProps} />
  },
}
const landingPageMainColumnItems: AddOnMap<AddonItemNoKey> = {
  resourceList: {
    Item: () => {
      const props = useMyLandingPageResourceListDataProps()
      return <LandingResourceList {...props} />
    },
    position: 0,
  },
  collectionList: {
    Item: () => {
      const props = useMyLandingPageCollectionListDataProps()
      return <LandingCollectionList {...props} />
    },
    position: 1,
  },
  profileList: {
    Item: () => {
      const props = useMyLandingPageProfileListDataProps()
      return <LandingProfileList {...props} />
    },
    position: 2,
  },
}
LandingHookPlugin.register(function useLandingPagePlugin() {
  const myProfileContext = useMyProfileContext()
  const promptUserSetInterests = !!myProfileContext?.myInterests.promptUserSetInterests

  const addons = useMemo(() => {
    const plugin: LandingPlugin = {
      mainColumnItems: {
        promptSetInterestsBanner: promptUserSetInterests && promptSetInterestsBanner,
        ...landingPageMainColumnItems,
      },
    }
    return plugin
  }, [promptUserSetInterests])

  return addons
})
