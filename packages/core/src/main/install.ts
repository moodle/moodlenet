import { InstallPkgReq } from '../pkg-mng/types'
import { MainFolders, SysInstalledPkg, SysInstalledPkgs } from '../types/sys'
import { getRegistry } from './default-consts'
import { getMain } from './main'

type InstallCfg = {
  mainFolders: MainFolders
  installPkgReqs?: InstallPkgReq[]
  httpPort: number
  arangoUrl: string
}

export default async function install({
  mainFolders,
  httpPort,
  arangoUrl,
  installPkgReqs = defaultInstallPkgReqs(),
}: InstallCfg) {
  const main = await getMain({ mainFolders })
  const installationsPkgInfos = await Promise.all(
    installPkgReqs.map(installPkgReq =>
      main.pkgMng.install(installPkgReq).then(installed => ({ installPkgReq, ...installed })),
    ),
  )
  const packages = installationsPkgInfos.reduce<SysInstalledPkgs>((_, { /* ext, */ pkgInfo, installPkgReq, date }) => {
    const sysInstalledPkg: SysInstalledPkg = { env: {}, date, installPkgReq }
    sysInstalledPkg.env.default = defaultPkgConfig(pkgInfo.packageJson.name)
    return { ..._, [pkgInfo.id]: sysInstalledPkg }
  }, {})
  await main.writeSysConfig({
    packages,
    __FIRST_RUN__: true,
  })
  return main
  function defaultPkgConfig(pkgName: string) {
    const defConfigs = {
      '@moodlenet/http-server': { port: httpPort },
      '@moodlenet/arangodb': { config: arangoUrl },
    } as any
    return defConfigs[pkgName]
  }
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
  'arangodb': '0.1.0',
  'authentication-manager': '0.1.0',
  'react-app': '0.1.0',
  'extensions-manager': '0.1.0',
  'email-service': '0.1.0',
  'simple-email-auth': '0.1.0',
  // 'passport-auth': '0.1.0',
}
