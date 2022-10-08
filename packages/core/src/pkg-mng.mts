import execa from 'execa'
import { WORKING_DIR } from './main/env.mjs'
import { NPM_REGISTRY } from './pkg-mng/lib.mjs'
import { InstallPkgReq } from './pkg-mng/types.mjs'
import { PkgIdentifier } from './types.mjs'

export async function uninstall({ pkgId }: { pkgId: PkgIdentifier<any> }) {
  await execa('npm', ['uninstall', `${pkgId.name}`], {
    cwd: WORKING_DIR,
    timeout: 600000,
  })
}

export async function install(installPkgReqs: InstallPkgReq[]) {
  const installPkgsArgs = installPkgReqs.map(instReq =>
    instReq.type === 'npm'
      ? `${instReq.pkgId.name}@${instReq.pkgId.version}`
      : `file:${instReq.fromFolder}`,
  )
  await execa('npm', ['install', '--registry', NPM_REGISTRY, ...installPkgsArgs], {
    cwd: WORKING_DIR,
    timeout: 600000,
  })
}
