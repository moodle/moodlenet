import { InstallPkgReq } from '../pkg-mng/types'
import { MainFolders, SysInstalledPkgs } from '../types/sys'
import { getRegistry } from './default-consts'
import { getMain } from './main'

type InstallCfg = {
  mainFolders: MainFolders
  installPkgReqs?: InstallPkgReq[]
}

export default async function install({ mainFolders, installPkgReqs = defaultInstallPkgReqs() }: InstallCfg) {
  const main = await getMain({ mainFolders })
  const installationsPkgInfos = await Promise.all(installPkgReqs.map(_ => main.pkgMng.install(_)))

  const packages = installationsPkgInfos.reduce<SysInstalledPkgs>(
    (_, { id }) => ({ ..._, [id]: { configs: {}, __INSTALL_PROCEDURE_TODO: true } }),
    {},
  )
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
