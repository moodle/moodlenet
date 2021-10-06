import { isArray } from 'lodash'

const isNsPath = (_: any): _ is NsPath => typeof _ === 'string' && _.length > 0 //(/^[a-z]$/.test(_) || /^[a-z][a-z0-9-]*[a-z]$/.test(_))

declare const VALID_NS_SYM: unique symbol
const SYM_STUB = Symbol()
const LocalBindings = new Map<string, LocalBinding>()
const setLocalBinding = (_: Namespace, secBinding: Secondary | undefined) =>
  LocalBindings.set(namespaceString(_), { namespace: _, secBinding })
const hasLocalBinding = (_: Namespace) => LocalBindings.has(namespaceString(_))

function getLocalBinding(stubOrNamespace: any) {
  const namespace = getStubNamespace(stubOrNamespace)
  return namespace ? LocalBindings.get(namespaceString(namespace)) : undefined
}

const namespaceString = (_: Namespace) => _.join(':::')

type NsPath = string & { readonly [VALID_NS_SYM]: unique symbol }
type LocalBinding = {
  namespace: Namespace
  secBinding?: Secondary
}
type StubDef = {
  namespace: Namespace
}
type Namespace = NsPath[]
const isNamespace = (_: any): _ is Namespace => isArray(_) && _.every(isNsPath)

type Action = {
  args: any[]
  namespace: Namespace
}
type Secondary = (...action: any[]) => Promise<any>
type SecondaryStub<S extends Secondary> = S & { [SYM_STUB]: StubDef }

export function bind<S extends Secondary>(secStubOrNamespace: Namespace | SecondaryStub<S>, sec: S) {
  const stubNamespace = getStubNamespace(secStubOrNamespace)
  if (!stubNamespace) {
    console.error(secStubOrNamespace)
    throw new TypeError(`argument secStubOrNamespace [${stubNamespace}] is not a Stub or a namespace`)
  }

  const localbinding = getLocalBinding(stubNamespace)
  if (!localbinding) {
    throw new ReferenceError(`stub [${namespaceString(stubNamespace)}] not registered`)
  }
  console.log(`Binding: [${stubNamespace.join('][')}]`)
  if (localbinding.secBinding) {
    console.warn(`[${namespaceString(stubNamespace)}] already bound, overriding`)
  }
  localbinding.secBinding = sec
}

const getStubNamespace = (secStubOrNamespace: any) =>
  isNamespace(secStubOrNamespace) ? secStubOrNamespace : getDefStub(secStubOrNamespace)?.namespace

const getDefStub = (secStub: any) => (secStub ? (secStub[SYM_STUB] as StubDef | undefined) : undefined)

type Binding = (action: Action) => Promise<any>
type Config = {
  umbrella: Binding
}
const config: Config = {
  umbrella: localBindingError,
}

export const umbrella = (binding: Binding) => (config.umbrella = binding)
export const value = <T>(namespace: string[]): SecondaryStub<() => Promise<T>> => stub(namespace)

export function stub<Sec extends Secondary>(namespace: string[], defaultSec?: Sec): SecondaryStub<Sec> {
  if (!isNamespace(namespace)) {
    throw new Error(`${namespace && namespaceString(namespace as any)} is not a valid Namespace`)
  }

  if (hasLocalBinding(namespace)) {
    throw new Error(`stub [${namespaceString(namespace)}] already registered`)
  }
  const _stub: any = async (...args: any[]) => {
    const localbinding = getLocalBinding(namespace)
    if (!localbinding?.secBinding) {
      // return config.binding( packStubAction({ args, namespace }) as any)
      return (defaultSec ?? config.umbrella)({ args, namespace })
    }
    return localbinding.secBinding(...args) as any
  }
  _stub[SYM_STUB] = { namespace }
  setLocalBinding(namespace, undefined)
  return _stub // as SecondaryStub<Sec>
}

function localBindingError(action: Action): Promise<any> {
  const msg = `no local binding for [${namespaceString(action.namespace)}] - no alternative binding configured`
  console.error(msg)
  throw new Error(msg)
}
