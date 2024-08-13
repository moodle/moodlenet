declare const VALID_NS_SYM: unique symbol
declare const PLUG_DEF_SYM: unique symbol

export type NsPath = string & { readonly [VALID_NS_SYM]: unique symbol }
export type PlugRegistration = {
  namespace: Namespace
  socket?: Socket
}
export type PlugDef = {
  namespace: Namespace
}
export type Namespace = NsPath[]

export type Signal = {
  args: any[]
  namespace: Namespace
}
export type Socket = (...args: any[]) => Promise<any>
export type Plug<S extends Socket> = S & { [PLUG_DEF_SYM]?: PlugDef }

export type SockOf<Plg> = Plg extends Plug<infer S> ? S : never
export type Umbrella = (signal: Signal) => Promise<any>
export type Config = {
  umbrella: Umbrella
}
