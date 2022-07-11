import { createPkgMng } from '.'

const pkgMng = createPkgMng({ pkgsFolder: '../../.ignore/pkgmngfolder' })

pkgMng.getAllInstalledPackagesInfo().then(_ => console.log(_))
