import fs from 'fs'
import path from 'path'
import {
  ActionExtract,
  ActionResolver,
  ActionResp,
  AnyQMAction,
  AnyQMActionDef,
  AnyQMPort,
  AnyQMPortDef,
  QMActionDef,
  QMDeployerProvider,
  QMLink,
  QMPkg,
  QMPkgDef,
  QMPortType,
} from './types'

const QMPortSymbol = Symbol('QMPort')
const QMActionSymbol = Symbol('QMAction')

export const QMModule = (module: NodeModule) => {
  const { dir, name } = path.parse(module.filename)
  const pkg = getQMPkg(dir)
  const qmino_root_mod_rel_path = getModuleRelPath(pkg, dir, name)
  console.log(`linking module [${module.filename}] ports`)
  Object.entries(module.exports).forEach(([export_name, export_member]) => {
    const portDef = getQMPortDef(export_member)
    if (!portDef) {
      return
    }
    if (portDef.link) {
      // TODO: Yes we can! implement pipeline
      throw new Error(`can't link an port twice (${module.filename}#${export_name})`)
    }
    console.log(`linking port [${export_name}]`)
    const { type } = portDef
    const link = makeQMLink<AnyQMPort>(qmino_root_mod_rel_path, export_name, type, pkg)
    portDef.link = link
    console.log(`linked port [${displayId(link.id)}]`)
  })
}

// const displayPortId=(mPort:any)=>displayId(getQMPortDef(mPort)?.link?.id)
const displayId = (id?: string[]) => id?.join('::')

export const getAsQMPort = (_: any) => {
  const portDef = getQMPortDef(_)
  if (!portDef) {
    return
  }
  return _ as AnyQMPort
}

export const makeQMLink = <A extends AnyQMPort>(
  qmino_root_mod_rel_path: string[],
  export_name: string,
  type: QMPortType,
  pkg: QMPkg,
): QMLink<A> => {
  const path = [...qmino_root_mod_rel_path, export_name]
  const id = makeQMId(path, type, pkg)
  const link: QMLink<A> = {
    id,
    path,
    pkg,
  }
  return link
}

export const getModuleRelPath = (qmPkg: QMPkg, mod_dir: string, mod_name: string) => {
  const from = path.join(qmPkg.dir, ...qmPkg.qmino.root)
  const to = path.join(mod_dir, mod_name)
  const modRelPathStr = path.relative(from, to)
  return modRelPathStr.split(path.sep)
}

export const getQMPkg = (mod_dir: string): QMPkg => {
  //TODO: cache resolved roots and return by dir comparison if present
  const pkgFilename = path.join(mod_dir, 'package.json')
  try {
    const file_str = fs.readFileSync(pkgFilename, { encoding: 'utf-8' })
    const package_json = JSON.parse(file_str)
    const qmPkgDef: QMPkgDef | undefined = package_json?.qmino
    if (!(qmPkgDef && package_json)) {
      throw new Error(`qmino not found here ${mod_dir}`)
    }
    const qmPkg: QMPkg = {
      qmino: qmPkgDef,
      name: package_json.name,
      version: package_json.version,
      dir: mod_dir,
    }
    return qmPkg
  } catch {
    if (path.dirname(mod_dir) === mod_dir) {
      throw new Error('no more parent dir')
    }
    try {
      return getQMPkg(path.dirname(mod_dir))
    } catch {
      throw new Error(`qmino climbed up to root looking for ${mod_dir} home :/`)
    }
  }
}

export const makeQMId = (path: string[], type: QMPortType, { name, version }: QMPkg) => [type, name, version, ...path]
export const getQMPortDef = (_: any): AnyQMPortDef | undefined => (_ ? _[QMPortSymbol] : undefined)

export const wrapQMPort = <A extends AnyQMPort, QMT extends QMPortType>(original_port: A, type: QMT): A => {
  const port_wrap = (...args: any[]) => {
    const action = (...adapters: any[]) => original_port(...args)(...adapters)
    const actionDef: QMActionDef<AnyQMPortDef> = {
      portDef,
      args,
    }
    ;(action as any)[QMActionSymbol] = actionDef
    return action
  }

  const portDef: AnyQMPortDef = {
    port: port_wrap,
    type,
  }

  ;(port_wrap as any)[QMPortSymbol] = portDef
  return (port_wrap as any) as A
}
export const QMQuery = <A extends AnyQMPort>(a: A) => wrapQMPort(a, 'query')

export const getQMComandDef = (_: any): AnyQMActionDef | undefined => (_ ? _[QMActionSymbol] : undefined)

export const extractAction = <C extends AnyQMAction>(action: C): ActionExtract<C> => {
  const actionDef = getQMComandDef(action)
  if (!actionDef) {
    console.error(action)
    throw new Error(`not a qm action !`)
  }
  const { portDef, args } = actionDef
  const { type, link, port } = portDef
  if (!link) {
    console.error({ type, port })
    throw new Error(`this port has not been linked !`)
  }
  const { id, binder, path, pkg } = link
  if (!binder) {
    console.warn(`port ${id} has no local binder`)
  }
  const actionExtract: ActionExtract<C> = {
    type,
    link,
    port,
    id,
    binder,
    path,
    pkg,
    args,
    action,
  }
  return actionExtract
}

export const resolve = <C extends AnyQMAction>(action: C): (() => Promise<ActionResp<C>>) => {
  const actionExtract = extractAction(action)
  console.log(`resolving: [${displayId(actionExtract.id)}]`)
  return actionResolverDelegates[actionExtract.type](actionExtract)
}

export const attemptLocalResolve = <C extends AnyQMAction>(
  actionExtract: ActionExtract<C>,
): null | (() => Promise<ActionResp<C>>) => {
  const { binder, action, args, port } = actionExtract
  if (!binder) {
    return null
  }
  const { deployment } = binder
  if (!deployment) {
    return null
  }
  const { resolver } = deployment

  return () => resolver(action, args, port)()
}

export const queryResolver: ActionResolver = actionExtract => {
  const maybeLocalExecutor = attemptLocalResolve(actionExtract)
  if (!maybeLocalExecutor) {
    throw new Error(`transport unimplemented yet`)
  }
  return maybeLocalExecutor
}

const actionResolverDelegates: { [t in QMPortType]: ActionResolver } = {
  query: queryResolver,
  mutation: (() => {
    throw new Error('mutation unimplemented')
  }) as any,
  event: (() => {
    throw new Error('event unimplemented')
  }) as any,
}

export const bind = <A extends AnyQMPort>(port: A, binder: QMDeployerProvider<A>) => {
  const link = extractLink(port)
  console.log(`deploying ${displayId(link.id)}`)
  if (link.binder) {
    throw new Error(`port has already a binder`)
  }

  //FIXME: check this tsc error
  //@ts-ignore
  const any_binder: QMDeployerProvider<AnyQMPort> = binder
  link.binder = {
    init: any_binder,
  }
}

export const extractLink = (port: any) => {
  const portDef = extractDef(port)
  const link = portDef.link
  if (!link) {
    throw new Error(`port not linked`)
  }
  return link
}

export const extractBinder = (port: any) => {
  const link = extractLink(port)
  const binder = link.binder
  if (!binder) {
    throw new Error(`port has no binder`)
  }
  return binder
}

export const extractDef = (port: any) => {
  const portDef = getQMPortDef(port)
  if (!portDef) {
    throw new Error(`not an port`)
  }
  return portDef
}

export const deploy = async <P extends AnyQMPort>(port: P) => {
  const link = extractLink(port)
  console.log(`activating ${displayId(link.id)}`)
  const binder = extractBinder(port)
  if (binder.deployment) {
    throw new Error(`port is already active`)
  }
  const [resolver, teardown] = await binder.init()
  console.log(`${displayId(link.id)} initialized`)

  binder.deployment = {
    at: new Date(),
    resolver,
    teardown,
  }
}
