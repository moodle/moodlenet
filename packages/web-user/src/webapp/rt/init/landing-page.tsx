import { LandingCollectionList } from '@moodlenet/collection/ui'
import { CollectionContext } from '@moodlenet/collection/webapp'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { LandingResourceList } from '@moodlenet/ed-resource/ui'
import { ResourceContext } from '@moodlenet/ed-resource/webapp'
import { href } from '@moodlenet/react-app/common'
import type { LandingPlugin } from '@moodlenet/react-app/webapp'
import { LandingHookPlugin } from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'
import {
  LOGIN_PAGE_ROUTE_BASE_PATH,
  SETTINGS_PAGE_ROUTE_PATH,
  SIGNUP_PAGE_ROUTE_BASE_PATH,
} from '../../../common/webapp-routes.mjs'
import type { InterestInfoProps, PublishContentProps } from '../../ui/exports/ui.mjs'
import { InterestInfo, LandingProfileList, PublishContent } from '../../ui/exports/ui.mjs'
import { AuthCtx, useMyProfileContext } from '../exports.mjs'
import { useMyLandingPageCollectionListDataProps } from '../page/my-landing-page/MyLandingPageCollectionListHook.mjs'
import { useMyLandingPageProfileListDataProps } from '../page/my-landing-page/MyLandingPageProfileListHook.mjs'
import { useMyLandingPageResourceListDataProps } from '../page/my-landing-page/MyLandingPageResourceListHook.mjs'

const promptSetInterestsBanner: AddonItemNoKey = {
  position: 1,
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
    position: 2,
  },
  collectionList: {
    Item: () => {
      const props = useMyLandingPageCollectionListDataProps()
      return <LandingCollectionList {...props} />
    },
    position: 3,
  },
  profileList: {
    Item: () => {
      const props = useMyLandingPageProfileListDataProps()
      return <LandingProfileList {...props} />
    },
    position: 4,
  },
}

const publishContentPanelAddon: AddonItemNoKey = {
  Item: () => {
    const { createResource } = useContext(ResourceContext)
    const { createCollection } = useContext(CollectionContext)
    const { isAuthenticated } = useContext(AuthCtx)
    const publishContentProps = useMemo(() => {
      const props: PublishContentProps = {
        publishContentHrefs: {
          loginHref: href(LOGIN_PAGE_ROUTE_BASE_PATH),
          signUpHref: href(SIGNUP_PAGE_ROUTE_BASE_PATH),
          createResource,
          createCollection,
        },
        isAuthenticated,
      }
      return props
    }, [createCollection, createResource, isAuthenticated])

    return <PublishContent {...publishContentProps} />
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
      headerCardItems: {
        publishContentPanelAddon,
      },
    }
    return plugin
  }, [promptUserSetInterests])

  return addons
})
