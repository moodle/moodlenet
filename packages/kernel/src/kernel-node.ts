import { createRequire } from 'module'
import { join } from 'path'
import { inspect } from 'util'
import { create } from './kernel-core'
import { pkgDiskInfoOf } from './npm-pkg'
import { Ext } from './types'
export async function boot() {
  // console.log('*****')
  const cwd = process.cwd()
  const cfgPath = process.env.EXT_ENV ?? `${cwd}/ext-env`
  const global_env: Record<string, any> = require(cfgPath)
  const K = create({ extEnvVars: global_env })
  const activatePkgs = global_env['kernel.core.node'].activatePkgs as string[]
  console.log({ activatePkgs, cwd, global_env })
  const req = createRequire(join(cwd, 'node_modules'))

  const deployments = await Promise.all(
    activatePkgs
      .map(mainModPath => pkgDiskInfoOf(req.resolve(mainModPath)))
      .map(async pkgDiskInfo => {
        const exts: Ext[] = req(pkgDiskInfo.name).default
        // console.log({ exts })
        return Promise.all(exts.map(ext => K.deployExtension({ ext, pkgDiskInfo })))
      }),
  )

  console.log(
    inspect(
      deployments.map(_ => _.map(__ => __.extId).flat()),
      false,
      5,
      true,
    ),
  )
}
