import { createContext, PropsWithChildren, Provider, useContext } from 'react'
const NEVER_INITIALIZED_VALUE = Symbol() as any

export const createCtx = <Value,>(
  ctxName: string,
  initialValue: Value = NEVER_INITIALIZED_VALUE
) => {
  const _context = createContext<Value>(initialValue)

  const _useContext = () => {
    const _value = useContext(_context)
    if (_value === NEVER_INITIALIZED_VALUE) {
      throw new Error(`Context \`${ctxName}\` has no provided value`)
    }
    return _value
  }

  return [_useContext, _context.Provider] as const
}

type ValueGetterHook<Value> = () => Value

declare const CTX_VALUE_SYMBOL: unique symbol
export type CtxValue<Value> = () => Value & {
  readonly [CTX_VALUE_SYMBOL]: unique symbol
}
export type ProviderBag<Value> = readonly [
  key: string,
  ctxValue: CtxValue<Value>
]

export const useValue = <Value,>(useValue: CtxValue<Value>): Value =>
  (useValue as ValueGetterHook<Value>)()

export const ctxValueHookOver = <Value,>(
  useValue: ValueGetterHook<Value>
): CtxValue<Value> => useValue as CtxValue<Value>
export const ucvhOver = ctxValueHookOver

export const ctxValueHookOf = <Value,>(value: Value) =>
  (() => value) as CtxValue<Value>
export const ucvhOf = ctxValueHookOf

export const Provide = <Value,>({
  children,
  Provider,
  ctxValue,
}: PropsWithChildren<{
  Provider: Provider<Value>
  ctxValue: CtxValue<Value>
}>) => {
  const value = useValue(ctxValue)
  return <Provider value={value}>{children}</Provider>
}
