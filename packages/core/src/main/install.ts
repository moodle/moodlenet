import assert from 'assert'
import { InstallPkgReq } from '../pkg-mng/types'
import { MainFolders } from '../types/sys'
import { getMain } from './main'

type InstallCfg = {
  mainFolders: MainFolders
  installPkgReqs?: InstallPkgReq[]
}

export default async function install({ mainFolders, installPkgReqs = defaultInstallPkgReqs() }: InstallCfg) {
  const main = await getMain({ mainFolders })
  const installations = await Promise.all(
    installPkgReqs.map(async installPkgReq => {
      const { installationFolder, pkgExport } = await main.pkgMng.install(installPkgReq)
      const firstExtId = pkgExport.exts[0]!.id
      assert(firstExtId, `${installationFolder} has no exported ext!`)
      return {
        installedPackage: {
          installPkgReq,
          installationFolder,
        },
        enabledExtension: {
          installationFolder,
          extId: firstExtId,
        },
      }
    }),
  )

  await main.writeLocalDeplConfig({ extensions: {} })
  const installedPackages = installations.map(({ installedPackage }) => installedPackage)
  const enabledExtensions = installations.map(({ enabledExtension }) => enabledExtension)
  await main.writeSysConfig({ installedPackages, enabledExtensions })

  return main
}

function defaultInstallPkgReqs(): InstallPkgReq[] {
  return Object.entries(defaultCorePackages).map<InstallPkgReq>(([name, version]) => {
    return {
      type: 'npm',
      pkgId: `@moodlenet/${name}@${version}`,
    }
  })
}

export const defaultCorePackages = {
  'core': '0.0.1',
  'http-server': '0.0.1',
  'react-app': '0.0.1',
  'authentication-manager': '0.0.1',
  'simple-email-auth': '0.0.1',
  'extensions-manager': '0.0.1',
  'passport-auth': '0.0.1',
}
