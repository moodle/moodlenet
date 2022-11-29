import { SafePackageJson } from '@moodlenet/core'

export function extNameDescription(pkgJson: SafePackageJson) {
  const [displayName = '', description = ''] = (pkgJson.description ?? '').split('\n')
  return { displayName, description }
}
