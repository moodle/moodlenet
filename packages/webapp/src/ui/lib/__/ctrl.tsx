import { ComponentType, FC } from 'react'

export type UIPropsOf<UIProps, XK extends keyof UIProps = never> = Pick<UIProps, XK>
const CTRL_SYMB = Symbol('CTRL_SYMB')

export type CtrlHookOf<UIProps, HookArg, XK extends keyof UIProps = never> = (_: HookArg) => CtrlHookRetOf<UIProps, XK>

type Wrapper<T> = [ComponentType<T>, T]
export type CtrlHookRetOf<UIProps, XK extends keyof UIProps = never> = [
  Omit<UIProps, XK>,
  {
    wrappers: Wrapper<any>[]
  },
]

export const withPropsFor = <UIProps, HookArg = unknown, XK extends keyof UIProps = never>({
  useCtrlHook: ctrlHook,
  hookArg,
  key,
}: { key?: CKey } & StrictWithProps<UIProps, XK, HookArg>[typeof CTRL_SYMB]): WithProps<UIProps, XK, HookArg> => {
  return {
    key,
    [CTRL_SYMB]: {
      useCtrlHook: ctrlHook,
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

const RenderWithHook: FC<{
  wp: StrictWithProps<any>
  UIComp: ComponentType<any>
  uiProps: any
}> = ({ wp, UIComp, uiProps, children }) => {
  const { useCtrlHook, hookArg } = wp[CTRL_SYMB]
  const [feedProps, { wrappers }] = useCtrlHook(hookArg)

  return wrappers.reduce(
    (children, [WrCmp, wrProps]) => {
      return <WrCmp {...wrProps}>{children}</WrCmp>
    },
    <UIComp {...feedProps} {...uiProps}>
      {children}
    </UIComp>,
  )
}

export const withProps = <UIProps, XK extends keyof UIProps = never>(
  UIComp: ComponentType<UIProps>,
  wp: WithProps<UIProps, XK>,
): readonly [CtrlComp: ComponentType<UIPropsOf<UIProps, XK> & Opaque<UIProps, XK>>, opaque: Opaque<UIProps, XK>] => {
  return [
    Render as any,
    ({
      wp,
      UIComp,
      ...wp,
    } as any) as Opaque<UIProps, XK>,
  ] as const
}

type Opaque<UIProps, XK> = {
  [CTRL_SYMB]: {
    UIProps: UIProps
    XK: XK
  }
  key?: CKey
}
type CKey = string | number | null | undefined
const Render: FC<{ wp: WithProps<any>; UIComp: ComponentType<any> }> = ({ UIComp, wp, children, ...uiProps }) => {
  if (CTRL_SYMB in wp) {
    return <RenderWithHook {...{ wp: wp as StrictWithProps<any>, UIComp, uiProps }}>{children}</RenderWithHook>
  } else {
    return <UIComp {...{ ...wp, ...uiProps }} />
  }
}
