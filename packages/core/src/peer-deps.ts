import { PkgInfo } from '@moodlenet/kernel'
import { resolve } from 'path'
const MN_PKG_PREFIX = '@moodlenet/'

const devDependencies: Record<string, string> = require(resolve(__dirname, '..', 'package.json')).devDependencies
const peerDependenciesEntries = Object.entries(devDependencies).filter(([pkgName]) => pkgName.startsWith('@moodlenet/'))

export const npmInstallList = ({ corePkgsFromFolder }: { corePkgsFromFolder?: string }) =>
  peerDependenciesEntries.map(([pkgId, version]) => {
    if (typeof corePkgsFromFolder === 'string' && pkgId.startsWith(MN_PKG_PREFIX)) {
      const pkgName = pkgId.replace(MN_PKG_PREFIX, '')
      return `file:${corePkgsFromFolder}/${pkgName}`
    } else {
      return `${pkgId}@${version}`
    }
  })

export const pkgsInfoList = (): PkgInfo[] =>
  peerDependenciesEntries.map(([pkgId, version]) => ({ name: pkgId, version }))

console.log({ npmInstallList: npmInstallList({ corePkgsFromFolder: '/aa' }), peerDependenciesEntries })
