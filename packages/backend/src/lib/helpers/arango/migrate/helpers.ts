import requireAll from 'require-all'
import { VersionLadder } from './types'

export const require_all_updaters = (opts_or_dir: Options | string): VersionLadder => {
  const opts = typeof opts_or_dir === 'string' ? { dirname: opts_or_dir } : opts_or_dir
  const steps = requireAll(opts)
  const ladder = Object.entries(steps).reduce<VersionLadder>(
    (_ladder, [version, step]) => ({ ..._ladder, [version]: step }),
    {},
  )
  return ladder
}

// copied from node_modules/@types/require-all/index.d.ts
interface Options {
  dirname: string
  filter?: ((name: string, path: string) => string | false | undefined) | RegExp | undefined
  excludeDirs?: RegExp | undefined
  map?: ((name: string, path: string) => string) | undefined
  resolve?: ((module: any) => any) | undefined
  recursive?: true | false | undefined
}
