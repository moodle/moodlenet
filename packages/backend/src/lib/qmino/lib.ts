import fs from 'fs'
import path from 'path'
import { InProcessActionResolverDelegates } from './transports/in-process'
import * as QM from './types'

const QMPortSymbol = Symbol('QMPort')
const QMActionSymbol = Symbol('QMAction')

export const QMModule = (module: NodeModule) => {
  const { dir, name } = path.parse(module.filename)
  const pkg = getQMPkg(dir)
  const qmino_root_mod_rel_path = getModuleRelPath(pkg, dir, name)
  console.log(`\nlinking module [${module.filename}] ports`)
  Object.entries(module.exports).forEach(([export_name, export_member]) => {
    const portDef = getQMPortDef(export_member)
    if (!portDef) {
      return
    }
    if (portDef.link) {
      throw new Error(`can't link an port twice (${module.filename}#${export_name})`)
    }
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

export const wrapQMPort = <Port extends QM.AnyQMPort, PortType extends QM.QMPortType>(
  original_port: Port,
  type: PortType,
): Port => {
  const port_wrap = (...args: any[]) => {
    const action = (adapter: any) => original_port(...args)(adapter)
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
  return port_wrap as any as Port
}
export const QMQuery = <P extends QM.AnyQMPort>(p: P) => wrapQMPort(p, 'query')
export const QMCommand = <P extends QM.AnyQMPort>(p: P) => wrapQMPort(p, 'command')

export const getQMActionDef = (_: any): QM.AnyQMActionDef | undefined => (_ ? _[QMActionSymbol] : undefined)

export const extractAction = <C extends QM.AnyQMAction>(action: C): QM.ActionExtract<C> => {
  const actionDef = getQMActionDef(action)
  if (!actionDef) {
    console.error(action)
    throw new Error(`not a qm action !`)
  }
  const { portDef /* , args */ } = actionDef
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
    id,
    deployment,
    path,
    pkg,
    action,
    // port,
    // args,
  }
  return actionExtract
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

export const open = async <P extends QM.AnyQMPort>(
  port: P,
  adapter: QM.QMAdapter<P>,
  teardown?: QM.Teardown,
  _transportName?: string,
) => {
  // const transport = getTransport(transportName)
  const link = extractLink(port)
  console.log(`open port: ${displayId(link.id)}`)

  link.deployment = {
    at: new Date(),
    teardown,
    adapter,
  }
}

export const resolve = <Action extends QM.AnyQMAction>(action: Action): QM.QMActionExecutor<Action> => {
  const actionExtract = extractAction(action)
  console.log(`resolving: [${displayId(actionExtract.id)}]`)
  return InProcessActionResolverDelegates[actionExtract.type](actionExtract)
}

const transportRegistry: Record<string, QM.Transport> = {}
export const getTransport = (name: string): QM.Transport | null => transportRegistry[name] ?? null
export const registerTransport = (name: string, transport: QM.Transport) => {
  const existingRegisteredTransport = getTransport(name)
  if (existingRegisteredTransport) {
    if (existingRegisteredTransport !== transport) {
      throw new Error(`Another Transport [${name}] already registered !`)
    }
    return
  }
  transportRegistry[name] = transport
}
