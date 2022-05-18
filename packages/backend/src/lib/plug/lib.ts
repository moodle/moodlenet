import { inspect } from 'util'
import { Config, Namespace, NsPath, Plug, PlugDef, PlugRegistration, Signal, Socket, Umbrella } from '.'

const isNsPath = (_: any): _ is NsPath => typeof _ === 'string' && _.length > 0 //(/^[a-z]$/.test(_) || /^[a-z][a-z0-9-]*[a-z]$/.test(_))
const isNamespace = (_: any): _ is Namespace => Array.isArray(_) && _.every(isNsPath)

const PLUG_DEF_SYM = Symbol()
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
  // console.log(`Plug [${namespaceString(plugNamespace)}] to socket`)
  plugRegistration.socket = sock
}

const getPlugNamespace = (plugOrNamespace: any) =>
  isNamespace(plugOrNamespace) ? plugOrNamespace : getPlugDef(plugOrNamespace)?.namespace

const getPlugDef = (plug: any) => (plug ? (plug[PLUG_DEF_SYM] as PlugDef | undefined) : undefined)

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
    const respPromise = plugRegistration?.socket
      ? plugRegistration.socket(...args)
      : config.umbrella({ args, namespace })
    logResp(namespace, args, respPromise)
    return respPromise
  }
  _plug[PLUG_DEF_SYM] = { namespace }
  setPlugRegistration(namespace, defaultSocket)
  return _plug // as SecondaryPlug<Sec>
}

function logResp(namespace: Namespace, args: any[], respPromise: Promise<any>) {
  respPromise
    .then((_: any) => ({ success: true, args, response: _ } as const))
    .catch((_: any) => ({ success: false, args, error: _ } as const))
    .then(_ => {
      const logfn = _.success ? console.log : console.error
      logfn(`socket call ${_.success ? 'success' : 'error'}: ${namespaceString(namespace)}`)
      if (!_.success) {
        logfn(
          `args:`,
          inspect(_.args, false, 5, true),
          `\nError: \n`,
          _.error instanceof Error ? `${_.error.message}\n${_.error.stack}` : _.error,
        )
      }
    })
}

function noUmbrellaError(signal: Signal): Promise<any> {
  const msg = `No local socket for plug [${namespaceString(signal.namespace)}] and no umbrella socket configured`
  // console.error(msg)
  throw new Error(msg)
}

export const checkAndLogUnboundPlugRegistrations = () => {
  const missingSockets = getPlugRegistrations()
    .filter(_ => !_.socket)
    .map(_ => namespaceString(_.namespace))

  missingSockets.length
    ? console.warn(`\nSome plugs don't have a local socket :\n- ${missingSockets.join('\n- ')}\n`)
    : console.log(`\nAll plugs locally bound!\n`)
  if (missingSockets.length && config.umbrella === noUmbrellaError) {
    throw new Error(`Missing umbrella!`)
  }
  return missingSockets
}
