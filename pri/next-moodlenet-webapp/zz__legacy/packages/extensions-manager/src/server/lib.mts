import { pkgRegistry } from '@moodlenet/core'
import type { DeployedPkgInfo } from '../common/data.mjs'

export async function listDeployed() {
  const entries = await pkgRegistry.listEntries()
  return entries.map<DeployedPkgInfo>(entry => ({
    packageJson: entry.pkgInfo.packageJson,
    pkgId: entry.pkgId,
    readme: entry.pkgInfo.readme,
  }))
}
