import { InstallPkgReq } from '../pkg-mng/types'
import { MainFolders, SysInstalledPkg, SysInstalledPkgs } from '../types/sys'
import { getRegistry } from './default-consts'
import { getMain } from './main'

type InstallCfg = {
  mainFolders: MainFolders
  installPkgReqs?: InstallPkgReq[]
  defaultPkgEnv(pkgName: string): any
}

export default async function install({
  mainFolders,
  installPkgReqs = defaultInstallPkgReqs(),
  defaultPkgEnv = () => undefined,
}: InstallCfg) {
  const main = await getMain({ mainFolders })
  const installationsPkgInfos = await Promise.all(
    installPkgReqs.map(installPkgReq =>
      main.pkgMng.install(installPkgReq).then(installed => ({ installPkgReq, ...installed })),
    ),
  )
  const packages = installationsPkgInfos.reduce<SysInstalledPkgs>((_, { /* ext, */ pkgInfo, installPkgReq, date }) => {
    const sysInstalledPkg: SysInstalledPkg = { env: {}, date, installPkgReq }
    sysInstalledPkg.env.default = defaultPkgEnv(pkgInfo.packageJson.name)
    return { ..._, [pkgInfo.id]: sysInstalledPkg }
  }, {})
  await main.writeSysConfig({
    packages,
    __FIRST_RUN__: true,
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
  'arangodb': '0.1.0',
  'key-value-store': '0.1.0',
  'crypto': '0.1.0',
  'authentication-manager': '0.1.0',
  'http-server': '0.1.0',
  'react-app': '0.1.0',
  'content-graph': '0.1.0',
  'email-service': '0.1.0',
  'extensions-manager': '0.1.0',
  'profile-page': '0.0.1',
  'simple-email-auth': '0.1.0',
  'organization': '0.1.0',
  // 'passport-auth': '0.1.0',
}
