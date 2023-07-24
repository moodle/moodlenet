import { LandingCollectionList } from '@moodlenet/collection/ui'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { LandingResourceList } from '@moodlenet/ed-resource/ui'
import { LandingHookPlugin } from '@moodlenet/react-app/webapp'
import { LandingProfileList } from '../../ui/exports/ui.mjs'
import { useMyLandingPageCollectionListDataProps } from '../page/my-landing-page/MyLandingPageCollectionListHook.mjs'
import { useMyLandingPageProfileListDataProps } from '../page/my-landing-page/MyLandingPageProfileListHook.mjs'
import { useMyLandingPageResourceListDataProps } from '../page/my-landing-page/MyLandingPageResourceListHook.mjs'

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
  return {
    mainColumnItems: landingPageMainColumnItems,
  }
})
