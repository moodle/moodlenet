import { InstallPkgReq } from '../pkg-mng/types'
import { MainFolders, SysInstalledPkg, SysInstalledPkgs } from '../types/sys'
import { getRegistry } from './default-consts'
import { getMain } from './main'

type InstallCfg = {
  mainFolders: MainFolders
  installPkgReqs?: InstallPkgReq[]
  httpPort: number
}

export default async function install({ mainFolders, httpPort, installPkgReqs = defaultInstallPkgReqs() }: InstallCfg) {
  const main = await getMain({ mainFolders })
  const installationsPkgInfos = await Promise.all(
    installPkgReqs.map(installPkgReq =>
      main.pkgMng.install(installPkgReq).then(installed => ({ installPkgReq, ...installed })),
    ),
  )
  const packages = installationsPkgInfos.reduce<SysInstalledPkgs>((_, { /* ext, */ pkgInfo, installPkgReq, date }) => {
    const sysInstalledPkg: SysInstalledPkg = { env: {}, date, installPkgReq }
    if (pkgInfo.packageJson.name === '@moodlenet/http-server') {
      sysInstalledPkg.env[''] = { port: httpPort }
    }
    return { ..._, [pkgInfo.id]: sysInstalledPkg }
  }, {})
  await main.writeSysConfig({
    packages,
  })
  return main
}

function defaultInstallPkgReqs(): InstallPkgReq[] {
  return Object.entries(defaultCorePackages).map<InstallPkgReq>(([name, version]) => {
    return {
      type: 'npm',
      pkgId: `@moodlenet/${name}@${version}`,
      registry: getRegistry(),
    }
  })
}

export const defaultCorePackages = {
  // 'core': '0.1.0',
  'http-server': '0.1.0',
  'react-app': '0.1.0',
  'authentication-manager': '0.1.0',
  'simple-email-auth': '0.1.0',
  'extensions-manager': '0.1.0',
  // 'passport-auth': '0.1.0',
}
