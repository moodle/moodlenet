import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { useContext } from 'react'
import { OrganizationCtx } from '../../../../context/OrganizationCtx.js'
import { createPlugin } from '../../../../web-lib/create-plugin.mjs'
import { useMainLayoutProps } from '../../layout/MainLayout/MainLayoutHooks.mjs'
import type { LandingProps } from './Landing.js'

export type LandingPlugin = {
  mainColumnItems?: AddOnMap<AddonItemNoKey>
  headerCardItems?: AddOnMap<AddonItemNoKey>
}

export const LandingHookPlugin = createPlugin<LandingPlugin>()

export const useLandingPageProps = (): LandingProps => {
  const plugins = LandingHookPlugin.usePluginHooks()
  const { organizationData } = useContext(OrganizationCtx)
  return {
    mainLayoutProps: useMainLayoutProps(),
    title: organizationData.landingTitle,
    subtitle: organizationData.landingSubtitle,
    mainColumnItems: plugins.getKeyedAddons('mainColumnItems'),
    headerCardItems: plugins.getKeyedAddons('headerCardItems'),
  }
}
