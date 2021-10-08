import { isArray } from 'lodash'
import { inspect } from 'util'

const isNsPath = (_: any): _ is NsPath => typeof _ === 'string' && _.length > 0 //(/^[a-z]$/.test(_) || /^[a-z][a-z0-9-]*[a-z]$/.test(_))

declare const VALID_NS_SYM: unique symbol
const SYM_PLUG = Symbol()
const PlugRegistrations = new Map<string, PlugRegistration>()
const setPlugRegistration = (namespace: Namespace, socket: Socket | undefined) =>
  PlugRegistrations.set(namespaceString(namespace), { namespace: namespace, socket: socket })
const hasRegisteredPlug = (namespace: Namespace) => PlugRegistrations.has(namespaceString(namespace))
export const getPlugRegistrations = () => Array.from(PlugRegistrations.values())

function getPlugRegistration(plugOrNamespace: any) {
  const namespace = getPlugNamespace(plugOrNamespace)
  return namespace ? PlugRegistrations.get(namespaceString(namespace)) : undefined
}

const namespaceString = (namespace: Namespace) => namespace.join(':::')

type NsPath = string & { readonly [VALID_NS_SYM]: unique symbol }
type PlugRegistration = {
  namespace: Namespace
  socket?: Socket
}
type PlugDef = {
  namespace: Namespace
}
type Namespace = NsPath[]
const isNamespace = (_: any): _ is Namespace => isArray(_) && _.every(isNsPath)

type Signal = {
  args: any[]
  namespace: Namespace
}
type Socket = (...args: any[]) => Promise<any>
type Plug<S extends Socket> = S & { [SYM_PLUG]: PlugDef }

export function socket<Sock extends Socket>(plugOrNamespace: Namespace | Plug<Sock>, sock: Sock) {
  const plugNamespace = getPlugNamespace(plugOrNamespace)
  if (!plugNamespace) {
    console.error(plugOrNamespace)
    throw new TypeError(`Argument \`plugOrNamespace\` [${plugNamespace}] is neither a Plug or a namespace`)
  }

  const plugRegistration = getPlugRegistration(plugNamespace)
  if (!plugRegistration) {
    throw new ReferenceError(`Plug [${namespaceString(plugNamespace)}] not registered`)
  }
  if (plugRegistration.socket) {
    const error = `Attempting to plug [${namespaceString(plugNamespace)}] already bound`
    console.error(error)
    throw new ReferenceError(error)
  }
  console.log(`Plug [${namespaceString(plugNamespace)}] to socket`)
  plugRegistration.socket = sock
}

const getPlugNamespace = (secPlugOrNamespace: any) =>
  isNamespace(secPlugOrNamespace) ? secPlugOrNamespace : getPlugDef(secPlugOrNamespace)?.namespace

const getPlugDef = (secPlug: any) => (secPlug ? (secPlug[SYM_PLUG] as PlugDef | undefined) : undefined)

export type SockOf<Plg> = Plg extends Plug<infer S> ? S : never
type Umbrella = (signal: Signal) => Promise<any>
type Config = {
  umbrella: Umbrella
}
const config: Config = {
  umbrella: noUmbrellaError,
}

export const umbrella = (umbrella: Umbrella) => (config.umbrella = umbrella)
export const value = <T>(namespace: string[], defaultValue?: T): Plug<() => Promise<T>> =>
  plug(namespace, defaultValue && (async () => defaultValue))

export function plug<Sock extends Socket>(namespace: string[], defaultSocket?: Sock): Plug<Sock> {
  if (!isNamespace(namespace)) {
    throw new Error(`[${namespace && namespaceString(namespace as any)}] is not a valid Namespace`)
  }

  if (hasRegisteredPlug(namespace)) {
    throw new Error(`Plug [${namespaceString(namespace)}] already registered`)
  }
  const _plug: any = async (...args: any[]) => {
    const plugRegistration = getPlugRegistration(namespace)
    const resp = plugRegistration?.socket
      ? (plugRegistration.socket(...args) as any)
      : config.umbrella({ args, namespace })
    resp
      .then((_: any) => ({ success: true, resp: _, args } as const))
      .catch((_: any) => ({ success: false, err: _, args } as const))
      .then((_: any) => {
        console.log(`\n-----------------\n`)
        console.log(`socket:${namespaceString(namespace)}:\n`, inspect(_, false, 5, true).substring(0, 750))
        console.log(`\n-----------------\n`)
      })
    return resp
  }
  _plug[SYM_PLUG] = { namespace }
  setPlugRegistration(namespace, defaultSocket)
  return _plug // as SecondaryPlug<Sec>
}

function noUmbrellaError(signal: Signal): Promise<any> {
  const msg = `No local socket for plug [${namespaceString(signal.namespace)}] and no umbrella socket configured`
  console.error(msg)
  throw new Error(msg)
}

export const checkAndLogUnboundPlugRegistrations = () => {
  const missingSockets = getPlugRegistrations()
    .filter(_ => !_.socket)
    .map(_ => namespaceString(_.namespace))

  missingSockets.length
    ? console.warn(`\nMissing some plugs local socket\n- ${missingSockets.join('\n- ')}\n`)
    : console.log(`\nAll plugs locally bound!\n`)
  if (missingSockets.length && config.umbrella === noUmbrellaError) {
    throw new Error(`Missing umbrella!`)
  }
  return missingSockets
}
