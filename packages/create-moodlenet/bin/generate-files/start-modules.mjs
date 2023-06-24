import { cp } from 'fs/promises'
import { resolve } from 'path'
import { installDir, myPkgDir } from '../env.mjs'

await cp(resolve(myPkgDir, 'bin', 'install-modules', 'start.mjs'), resolve(installDir, 'start.mjs'))
await cp(
  resolve(myPkgDir, 'bin', 'install-modules', 'ignitor.mjs'),
  resolve(installDir, 'ignitor.mjs'),
)
