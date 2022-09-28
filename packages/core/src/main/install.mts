import { getRegistry } from '../pkg-mng/lib.mjs'
import { InstallPkgReq } from '../pkg-mng/types.mjs'
import { InstallResp, MainFolders, SysInstalledPkg } from '../types.mjs'
import { getSys } from './sys.mjs'

type InstallCfg = {
  mainFolders: MainFolders
  installPkgReqs?: InstallPkgReq[]
  defaultPkgEnv(pkgName: string): any
}

export async function install({
  mainFolders,
  installPkgReqs = defaultInstallPkgReqs(),
  defaultPkgEnv = () => undefined,
}: InstallCfg) {
  console.log('installing:', installPkgReqs)
  const sys = await getSys({ mainFolders })

  const installationsPkgInfosThunks = installPkgReqs.map(installPkgReq => () => {
    console.log('installing...', { installPkgReq })
    return sys.pkgMng.install(installPkgReq).then(installResp => ({ installPkgReq, installResp }))
  })
  const installationsPkgInfos: { installPkgReq: InstallPkgReq; installResp: InstallResp }[] = []
  for (const installationsPkgInfosThunk of installationsPkgInfosThunks) {
    installationsPkgInfos.push(await installationsPkgInfosThunk())
  }

  // console.log({ installationsPkgInfosc })
  const packages = installationsPkgInfos.map<SysInstalledPkg>(({ installResp: { sysInstalledPkg } }) => ({
    ...sysInstalledPkg,
    env: {
      default: defaultPkgEnv(sysInstalledPkg.pkgId.name),
    },
  }))

  await sys.writeSysConfig({
    packages,
  })
  return sys
}

function defaultInstallPkgReqs(): InstallPkgReq[] {
  return Object.entries(defaultCorePackages).map(([name, version]) => {
    const installPkgReq: InstallPkgReq = {
      type: 'npm',
      pkgId: {
        name: `@moodlenet/${name}`,
        version,
      },

      registry: getRegistry(),
    }
    return installPkgReq
  })
}

export const defaultCorePackages = {
  'core': '0.1.0',
  'arangodb': '0.1.0',
  'key-value-store': '0.1.0',
  'crypto': '0.1.0',
  'authentication-manager': '0.1.0',
  'http-server': '0.1.0',
  'organization': '0.1.0',
  'content-graph': '0.1.0',
  'react-app': '0.1.0',
  'email-service': '0.1.0',
  // 'extensions-manager': '0.1.0',
  // 'web-user': '0.1.0',
  // 'simple-email-auth': '0.1.0',
  'test-extension': '0.1.0',
  'test-extension-2': '0.1.0',
  // 'passport-auth': '0.1.0',
}
