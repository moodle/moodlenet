import fs from 'fs'
import path from 'path'
import * as QM from './types'

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
    const link = makeQMLink<QM.AnyQMPort>(qmino_root_mod_rel_path, export_name, type, pkg)
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
  return _ as QM.AnyQMPort
}

export const makeQMLink = <A extends QM.AnyQMPort>(
  qmino_root_mod_rel_path: string[],
  export_name: string,
  type: QM.QMPortType,
  pkg: QM.QMPkg,
): QM.QMLink<A> => {
  const path = [...qmino_root_mod_rel_path, export_name]
  const id = makeQMId(path, type, pkg)
  const link: QM.QMLink<A> = {
    id,
    path,
    pkg,
  }
  return link
}

export const getModuleRelPath = (qmPkg: QM.QMPkg, mod_dir: string, mod_name: string) => {
  const from = path.join(qmPkg.dir, ...qmPkg.qmino.root)
  const to = path.join(mod_dir, mod_name)
  const modRelPathStr = path.relative(from, to)
  return modRelPathStr.split(path.sep)
}

export const getQMPkg = (mod_dir: string): QM.QMPkg => {
  //TODO: cache resolved roots and return by dir comparison if present
  const pkgFilename = path.join(mod_dir, 'package.json')
  try {
    const file_str = fs.readFileSync(pkgFilename, { encoding: 'utf-8' })
    const package_json = JSON.parse(file_str)
    const qmPkgDef: QM.QMPkgDef | undefined = package_json?.qmino
    if (!(qmPkgDef && package_json)) {
      throw new Error(`qmino not found here ${mod_dir}`)
    }
    const qmPkg: QM.QMPkg = {
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

export const makeQMId = (path: string[], type: QM.QMPortType, { name, version }: QM.QMPkg) => [
  type,
  name,
  version,
  ...path,
]
export const getQMPortDef = (_: any): QM.AnyQMPortDef | undefined => (_ ? _[QMPortSymbol] : undefined)

export const wrapQMPort = <A extends QM.AnyQMPort, QMT extends QM.QMPortType>(original_port: A, type: QMT): A => {
  const port_wrap = (...args: any[]) => {
    const action = (...adapters: any[]) => original_port(...args)(...adapters)
    const actionDef: QM.QMActionDef<QM.AnyQMPortDef> = {
      portDef,
      args,
    }
    ;(action as any)[QMActionSymbol] = actionDef
    return action
  }

  const portDef: QM.AnyQMPortDef = {
    port: port_wrap,
    type,
  }

  ;(port_wrap as any)[QMPortSymbol] = portDef
  return (port_wrap as any) as A
}
export const QMQuery = <P extends QM.AnyQMPort>(p: P) => wrapQMPort(p, 'query')
export const QMMutation = <P extends QM.AnyQMPort>(p: P) => wrapQMPort(p, 'mutation')

export const getQMComandDef = (_: any): QM.AnyQMActionDef | undefined => (_ ? _[QMActionSymbol] : undefined)

export const extractAction = <C extends QM.AnyQMAction>(action: C): QM.ActionExtract<C> => {
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
  const { id, deployment, path, pkg } = link
  if (!deployment) {
    console.warn(`port ${id} has no local deployment`)
  }
  const actionExtract: QM.ActionExtract<C> = {
    type,
    link,
    port,
    id,
    deployment,
    path,
    pkg,
    args,
    action,
  }
  return actionExtract
}

export const attemptLocalResolve = <Action extends QM.AnyQMAction>(
  actionExtract: QM.ActionExtract<Action>,
): null | (() => Promise<QM.QMActionResponse<Action>>) => {
  const { deployment, action, args, port } = actionExtract
  if (!deployment) {
    return null
  }
  const { resolver } = deployment

  return () => resolver(action, args, port)
}

export const queryResolver: QM.ActionResolver = actionExtract => {
  const maybeLocalExecutor = attemptLocalResolve(actionExtract)
  if (!maybeLocalExecutor) {
    throw new Error(`transport unimplemented yet`)
  }
  return maybeLocalExecutor
}

const actionResolverDelegates: { [t in QM.QMPortType]: QM.ActionResolver } = {
  query: queryResolver,
  mutation: queryResolver,
  event: (() => {
    throw new Error('event unimplemented')
  }) as any,
}

export const extractLink = (port: any) => {
  const portDef = extractDef(port)
  const link = portDef.link
  if (!link) {
    throw new Error(`port not linked`)
  }
  return link
}

export const extractDef = (port: any) => {
  const portDef = getQMPortDef(port)
  if (!portDef) {
    throw new Error(`not an port`)
  }
  return portDef
}

export const deploy = async <P extends QM.AnyQMPort>(
  port: P,
  [resolver, teardown]: QM.QMDeployer<P>,
  _transport?: any,
) => {
  const link = extractLink(port)
  console.log(`${displayId(link.id)} initialized`)

  link.deployment = {
    at: new Date(),
    teardown,
    //@ts-ignore
    //FIXME: check this tsc error on `resolver` var type
    resolver,
  }
}

export const resolve = <Action extends QM.AnyQMAction>(action: Action): QM.QMActionExecutor<Action> => {
  const actionExtract = extractAction(action)
  console.log(`resolving: [${displayId(actionExtract.id)}]`)
  return actionResolverDelegates[actionExtract.type](actionExtract)
}
