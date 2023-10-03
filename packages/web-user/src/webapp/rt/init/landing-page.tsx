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

const setInterestsAlert: AddonItemNoKey = {
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
  },
  collectionList: {
    Item: () => {
      const props = useMyLandingPageCollectionListDataProps()
      return <LandingCollectionList {...props} />
    },
  },
  profileList: {
    Item: () => {
      const props = useMyLandingPageProfileListDataProps()
      return <LandingProfileList {...props} />
    },
  },
}
LandingHookPlugin.register(function useLandingPagePlugin() {
  const myProfileContext = useMyProfileContext()
  const showSetInterestsAlert = !!(myProfileContext && myProfileContext.myInterests.unset)
  const addons = useMemo(() => {
    const plugin: LandingPlugin = {
      mainColumnItems: {
        setInterestsAlert: showSetInterestsAlert && setInterestsAlert,
        ...landingPageMainColumnItems,
      },
    }
    return plugin
  }, [showSetInterestsAlert])

  return addons
})
