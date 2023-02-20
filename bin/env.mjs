import { mkdir } from 'fs/promises'
import { resolve } from 'path'
import yargs from 'yargs'

export const yOpts = yargs(process.argv.slice(2)).argv
export const { _, $0, ...restOpts } = yOpts
const [mnDevDirOpt, ...restArgs] = _
export const fwRestOpts = Object.entries(restOpts).reduce((_, [k, v]) => {
  return v === true ? [..._, `--${k}`] : [..._, `--${k}`, `${v}`]
}, [])
export const fwRestArgs = restArgs.map(String)
export const devMachinesDir = resolve(process.cwd(), `.dev-machines`)
export const mnDevDir = resolve(devMachinesDir, String(mnDevDirOpt))
// process.env.NODE_ENV = 'development'

await mkdir(mnDevDir, { recursive: true })

console.log({
  devMachinesDir,
  mnDevDir,
  mnDevDirOpt,
  fwRestOpts,
  fwRestArgs,
  _,
  $0,
  yOpts,
  restOpts,
  restArgs,
})
