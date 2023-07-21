import { getCurrentWebUserIds } from '@moodlenet/web-user/server'
import type { LmsSite, LmsWebUserConfig, SiteTarget } from '../common/types.mjs'
import { kvStore } from './init/kvStore.mjs'

export async function getUserConfigs({ configKey }: { configKey: string }) {
  const found = await kvStore.get('user-configs', configKey)
  return found.value
}
export async function setUserConfigs({
  configs,
  configKey,
}: {
  configKey: string
  configs: LmsWebUserConfig
}) {
  await kvStore.set('user-configs', configKey, configs)
}

async function getCurrentUserConfigKey() {
  const webUserIds = await getCurrentWebUserIds()
  return webUserIds ? webUserIds._key : false
}
export async function getCurrentUserConfigs() {
  const configKey = await getCurrentUserConfigKey()
  if (configKey === false) return false
  return getUserConfigs({ configKey })
}
export async function setCurrentUserConfigs({ configs }: { configs: LmsWebUserConfig }) {
  const configKey = await getCurrentUserConfigKey()
  if (configKey === false) return false
  return setUserConfigs({ configKey, configs })
}

export async function addMyLmsSiteTarget({
  siteTarget: { site, importTarget },
}: {
  siteTarget: SiteTarget
}) {
  const configs = await getCurrentUserConfigs()
  if (configs === false) return false
  const currSites = configs?.sites ?? []

  const foundSite = currSites.find(s => s.url === site)
  if (importTarget && foundSite) {
    const foundTarget = foundSite.importTargets.find(
      p => p.course === importTarget.course && p.section === importTarget.section,
    )
    foundSite.importTargets = foundTarget
      ? [foundTarget, ...foundSite.importTargets.filter(t => t !== foundTarget)]
      : [importTarget, ...foundSite.importTargets]
  }

  const updatedSites: LmsSite[] = foundSite
    ? [foundSite, ...currSites.filter(s => s !== foundSite)]
    : [{ url: site, importTargets: importTarget ? [importTarget] : [] }, ...currSites]

  const updatedConfigs: LmsWebUserConfig = {
    ...configs,
    sites: updatedSites,
  }
  await setCurrentUserConfigs({
    configs: updatedConfigs,
  })

  return updatedConfigs
}
