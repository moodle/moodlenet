import { ComponentType, FC, PropsWithChildren, ReactElement } from 'react'

export type UIPropsOf<UIProps, XK extends keyof UIProps = never> = Pick<UIProps, XK>
const rnd = Number(`${Math.random()}`.substring(2)).toString(36)
const CTRL_SYMB = (`___CTRL_SYMBOL___${rnd}` as any) as `___CTRL_SYMBOL___`

export type CtrlHookOf<UIProps, HookArg, XK extends keyof UIProps = never> = (_: HookArg) => CtrlHookRetOf<UIProps, XK>

export type Wrapper<C = ComponentType<any>> = C extends ComponentType<infer T> ? [ComponentType<T>, T] : never
export type CtrlHookRetOf<UIProps, XK extends keyof UIProps = never> = [
  Omit<UIProps, XK>,
  {
    wrap(ui: ReactElement): ReactElement
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
  const [feedProps, { wrap }] = useCtrlHook(hookArg)
  return wrap(<UIComp {...feedProps} {...uiProps} />)
}

export const withProps = <UIProps, XK extends keyof UIProps = never>(
  UIComp: FC<UIProps>,
): FC<UIPropsOf<UIProps, XK> & WithProps<UIProps, XK>> => {
  const Render = (props: PropsWithChildren<WithProps<UIProps, XK>>) => {
    if (CTRL_SYMB in props && (props as any)[CTRL_SYMB]) {
      // console.log('RenderWithHook', props)
      return RenderWithHook(props as PropsWithChildren<StrictWithProps<UIProps>>, UIComp, props)
    } else {
      return UIComp(props as PropsWithChildren<UIProps>)
    }
  }
  return Render
}

type CKey = string | number | null | undefined
