import type { AddonItemNoKey } from '@moodlenet/component-library'
import { useContext } from 'react'
import { OrganizationCtx } from '../../../../context/OrganizationCtx.js'
import { createHookPlugin } from '../../../../web-lib/plugins.mjs'
import { useMainLayoutProps } from '../../layout/MainLayout/MainLayoutHooks.mjs'
import type { LandingProps } from './Landing.js'

export const LandingHookPlugin = createHookPlugin<{
  mainColumnItems: AddonItemNoKey
}>({ mainColumnItems: null })

export const useLandingPageProps = (): LandingProps => {
  const [addons] = LandingHookPlugin.useHookPlugin()
  const { organizationData } = useContext(OrganizationCtx)
  return {
    mainLayoutProps: useMainLayoutProps(),
    title: organizationData.landingTitle,
    subtitle: organizationData.landingSubtitle,
    mainColumnItems: addons.mainColumnItems,
    search: () => undefined,
  }
}
