import { mkdir, rm } from 'fs/promises'
import { inspect } from 'util'
import { createPkgMng } from '.'
;(async function start() {
  const pkgsFolder = '../../.ignore/pkgmngfolder'
  await rm(pkgsFolder, { recursive: true, force: true })
  await mkdir(pkgsFolder, { recursive: true })
  const pkgMng = createPkgMng({ pkgsFolder })
  await pkgMng.install({
    type: 'symlink',
    fromFolder: '/home/alec/MOODLENET/repo/moodlenet3/packages/passport-auth',
  })
  // await pkgMng.install({ type: 'npm', registry: 'https://registry.npmjs.org', pkgId: 'tiny' })
  const allInfos = await pkgMng.getAllInstalledPackagesInfo()
  console.log(inspect(allInfos, false, 10, true))
})()
