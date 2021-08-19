import fs from 'fs'
import path from 'path'
import * as QM from './types'
export * from './types'

export const LinkedPorts = new WeakMap<QM.AnyQMPort, QM.AnyQMPortDef>()
export const PendingActions = new WeakMap<QM.AnyQMAction, QM.AnyQMActionDef>()
export const OpenPortsByTransport = new WeakMap<QM.Transport, QM.QMDeployment<QM.AnyQMPort>[]>()

export const TIMEOUT = Symbol('TIMEOUT')

export const QMModule = (module: NodeModule) => {
  const { dir, name } = path.parse(module.filename)
  const pkg = getQMPkg(dir)
  const qmino_root_mod_rel_path = getModuleRelPath(pkg, dir, name)
  console.log(`\nlinking module [${module.filename}] ports`)
  Object.entries(module.exports).forEach(([export_name, export_member]) => {
    const portDef = LinkedPorts.get(export_member as any)
    if (!portDef) {
      return
    }
    if (portDef.link) {
      throw new Error(`can't link an port twice (${module.filename}#${export_name})`)
    }
    const { type } = portDef
    const link = makeQMLink(qmino_root_mod_rel_path, export_name, type, pkg)
    portDef.link = link
    console.log(`linked port [${displayId(link.id)}]`)
  })
}

// const displayPortId=(mPort:any)=>displayId(getQMPortDef(mPort)?.link?.id)
const displayId = (id?: string[]) => id?.join('::')

export const getAsQMPort = (_: any) => {
  const portDef = LinkedPorts.get(_)
  if (!portDef) {
    return
  }
  return _ as QM.AnyQMPort
}

export const makeQMLink = (
  qmino_root_mod_rel_path: string[],
  export_name: string,
  type: QM.QMPortType,
  pkg: QM.QMPkg,
): QM.QMLink => {
  const path = [...qmino_root_mod_rel_path, export_name]
  const id = makeQMId(path, type, pkg)
  const link: QM.QMLink = {
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

export const makeQMId = (path: string[], type: QM.QMPortType, { name, version }: QM.QMPkg): QM.QMPortId => [
  type,
  name,
  version,
  ...path,
]

export const wrapQMPort = <Port extends QM.AnyQMPort, PortType extends QM.QMPortType>(
  original_port: Port,
  type: PortType,
): Port => {
  const port_wrap = (...args: any[]) => {
    const action = async (adapter: any) => {
      // console.log(`accessing port [${displayId(portDef.link?.id)}]( ${inspect(args)} )`)
      const resp = await original_port(...args)(adapter)
      // console.log(`RESP:port [${displayId(portDef.link?.id)}]\nRESP:args:${inspect(args)}\nRESP:${inspect(resp)}`)
      return resp
    }
    const actionDef: QM.AnyQMActionDef = {
      portDef,
      args,
    }
    PendingActions.set(action, actionDef)
    return action
  }

  const portDef: QM.AnyQMPortDef = {
    port: port_wrap,
    type,
  }

  LinkedPorts.set(port_wrap, portDef)
  return port_wrap as any as Port
}
export const QMQuery = <P extends QM.AnyQMPort>(p: P) => wrapQMPort(p, 'query')
export const QMCommand = <P extends QM.AnyQMPort>(p: P) => wrapQMPort(p, 'command')

export const extractAction = <C extends QM.AnyQMAction>(transport: QM.Transport, action: C): QM.ActionExtract<C> => {
  const actionDef = PendingActions.get(action)
  if (!actionDef) {
    console.error(action)
    throw new Error(`not a qm action !`)
  }
  const { portDef, args } = actionDef
  const { type, link, port } = portDef
  if (!link) {
    console.error({ type, port })
    throw new Error(
      `this port has not been linked!\ndid you forget to call \`QMModule(module)\` in this port module file?`,
    )
  }
  const { id, path, pkg } = link
  const deployment = OpenPortsByTransport.get(transport)?.find(
    deployment => LinkedPorts.get(deployment.port)?.link === link,
  )
  if (!deployment) {
    console.warn(`port ${id} has no local deployment`)
  }
  const actionExtract: QM.ActionExtract<C> = {
    type,
    link,
    id,
    deployment,
    transport,
    path,
    pkg,
    action,
    args,
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
  const portDef = LinkedPorts.get(port)
  if (!portDef) {
    throw new Error(
      `this port has not been linked!\ndid you forget to call \`QMModule(module)\` in this port module file?`,
    )
  }
  return portDef
}

export const open = async <P extends QM.AnyQMPort>(
  port: P,
  adapter: QM.QMAdapter<P>,
  transport: QM.Transport,
  teardown?: QM.Teardown,
) => {
  // const transport = getTransport(transportName)
  const link = extractLink(port)

  console.log(`open port: ${displayId(link.id)}`)

  const deployment: QM.QMDeployment<P> = {
    at: new Date(),
    async teardown() {
      await Promise.all([teardown && teardown(), transportDeployment.teardown()])
    },
    adapter,
    port,
  }
  const activeDeployments = OpenPortsByTransport.get(transport) || []

  OpenPortsByTransport.set(transport, activeDeployments.concat(deployment))

  const transportHandler: QM.TransportPortHandler = (...args: any[]) => port(...args)(adapter)

  const transportDeployment = await transport.open(link.id, transportHandler)
}
