import findroot from 'find-root'
import Module from 'module'
import { basename, extname, relative, resolve, sep } from 'path'

export function ns(_module: Module, sub: string) {
  const module_dir = _module.path
  const package_root_dir = findroot(module_dir)
  const { name: pckg, version, namespace } = require(resolve(package_root_dir, 'package.json'))

  const root: string[] = namespace?.root

  const ns_root_dir = resolve(package_root_dir, ...root)
  const mod_relative_path = relative(ns_root_dir, module_dir)

  const ext = extname(_module.filename)
  const modName = basename(_module.filename, ext)

  const fq_ns = [pckg as string, version as string, ...mod_relative_path.split(sep), modName, sub]

  return fq_ns
}
