import { ComponentType, FC, PropsWithChildren } from 'react'

export type UIPropsOf<UIProps, XK extends keyof UIProps = never> = Pick<UIProps, XK>
const rnd = Number(`${Math.random()}`.substring(2)).toString(36)
const CTRL_SYMB = (`___CTRL_SYMBOL___${rnd}` as any) as `CTRL_SYMB`

export type CtrlHookOf<UIProps, HookArg, XK extends keyof UIProps = never> = (_: HookArg) => CtrlHookRetOf<UIProps, XK>

export type Wrapper<C = ComponentType<any>> = C extends ComponentType<infer T> ? [ComponentType<T>, T] : never
export type CtrlHookRetOf<UIProps, XK extends keyof UIProps = never> = [
  Omit<UIProps, XK>,
  {
    wrappers: Wrapper[]
  },
]

export const withPropsFor = <UIProps, HookArg = unknown, XK extends keyof UIProps = never>({
  useCtrlHook,
  hookArg,
  key,
}: { key?: CKey } & StrictWithProps<UIProps, XK, HookArg>[typeof CTRL_SYMB]): WithProps<UIProps, XK, HookArg> => {
  return {
    key,
    [CTRL_SYMB]: {
      useCtrlHook,
      hookArg,
    },
  }
}

export type WithProps<UIProps, XK extends keyof UIProps = never, HookArg = unknown> = { key?: CKey } & (
  | StrictWithProps<UIProps, XK, HookArg>
  | UIProps
)

export type StrictWithProps<UIProps, XK extends keyof UIProps = never, HookArg = unknown> = {
  [CTRL_SYMB]: {
    useCtrlHook: CtrlHookOf<UIProps, HookArg, XK>
    hookArg: HookArg
  }
}

const RenderWithHook = (wp: PropsWithChildren<StrictWithProps<any>>, UIComp: ComponentType<any>, uiProps: any) => {
  const { useCtrlHook, hookArg } = wp[CTRL_SYMB]
  const [feedProps, { wrappers }] = useCtrlHook(hookArg)
  console.log({ feedProps, wrappers, useCtrlHook, hookArg })

  const ret = wrappers.reduce((children, [WrCmp, wrProps]) => {
    return <WrCmp {...wrProps}>{children}</WrCmp>
  }, <UIComp {...feedProps} {...uiProps} />)
  console.log({ ret, _: 'x' })
  return ret
}

export const withProps = <UIProps, XK extends keyof UIProps = never>(
  UIComp: FC<UIProps>,
): FC<UIPropsOf<UIProps, XK> & WithProps<UIProps, XK>> => {
  const Render = (props: PropsWithChildren<WithProps<UIProps, XK>>) => {
    if (CTRL_SYMB in props && (props as any)[CTRL_SYMB]) {
      console.log('RenderWithHook', props)
      return RenderWithHook(props as PropsWithChildren<StrictWithProps<UIProps>>, UIComp, props)
    } else {
      return UIComp(props as PropsWithChildren<UIProps>)
    }
  }
  return Render
}

// export const __withProps = <UIProps, XK extends keyof UIProps = never>(
//   UIComp: ComponentType<UIProps>,
//   wp: WithProps<UIProps, XK>,
// ): readonly [CtrlComp: ComponentType<UIPropsOf<UIProps, XK> & Opaque<UIProps, XK>>, opaque: Opaque<UIProps, XK>] => {
//   return [
//     Render as any,
//     ({
//       wp,
//       UIComp,
//       ...wp,
//     } as any) as Opaque<UIProps, XK>,
//   ] as const
// }

type CKey = string | number | null | undefined
