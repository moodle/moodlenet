import findroot from 'find-root'
import { relative, resolve, sep } from 'path'

export function ns(module_dir: string, sub: string) {
  const package_root_dir = findroot(module_dir)
  const { name: pckg, version, namespace } = require(resolve(package_root_dir, 'package.json'))

  const root: string[] = namespace?.root

  const ns_root_dir = resolve(package_root_dir, ...root)
  const mod_relative_path = relative(ns_root_dir, module_dir)

  const fq_ns = [pckg as string, version as string, ...mod_relative_path.split(sep), sub]

  return fq_ns
}
