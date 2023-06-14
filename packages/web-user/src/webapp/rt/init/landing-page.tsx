import { LandingCollectionList } from '@moodlenet/collection/ui'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import { LandingResourceList } from '@moodlenet/ed-resource/ui'
import type { PkgAddOns } from '@moodlenet/react-app/webapp'
import { LandingHookPlugin } from '@moodlenet/react-app/webapp'
import { useMyLandingPageCollectionListDataProps } from '../page/my-landing-page/MyLandingPageCollectionListHook.mjs'
import { useMyLandingPageResourceListDataProps } from '../page/my-landing-page/MyLandingPageResourceListHook.mjs'

const landingPageMainColumnItems: PkgAddOns<AddonItemNoKey> = {
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
}
LandingHookPlugin.register(function useLandingPagePlugin({ useMainColumnItems }) {
  useMainColumnItems(landingPageMainColumnItems)
})
