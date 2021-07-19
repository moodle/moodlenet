import { ComponentType, FC, PropsWithChildren, ReactElement } from 'react'

export type UIPropsOf<UIProps, ExcludeKeys extends keyof UIProps = never> = Pick<UIProps, ExcludeKeys>
const rnd = Number(`${Math.random()}`.substring(2)).toString(36)
const s = Symbol()
const CTRL_SYMB: typeof s = `___CTRL_SYMBOL___${rnd}` as any

export type CtrlHook<UIProps, HookArg, ExcludeKeys extends keyof UIProps = never> = (
  hookArg: HookArg,
) => CtrlHookRetOf<UIProps, ExcludeKeys>

export type Wrapper<C = ComponentType<any>> = C extends ComponentType<infer T> ? [ComponentType<T>, T] : never
export type CtrlHookRetOf<UIProps, ExcludeKeys extends keyof UIProps = never> =
  | [feedProps: Omit<UIProps, ExcludeKeys>, opts?: Partial<CtrlHookRetOpts>]
  | null
  | undefined

export type CtrlHookRetOpts = {
  wrap(ui: ReactElement): ReactElement
}

export const ctrlHook = <UIProps, HookArg, ExcludeKeys extends keyof UIProps = never>(
  useCtrlHook: CtrlHook<UIProps, HookArg, ExcludeKeys>,
  hookArg: HookArg,
  key?: CKey,
): ControlledProps<UIProps, ExcludeKeys, HookArg> => {
  return {
    key,
    [CTRL_SYMB]: {
      useCtrlHook,
      hookArg,
    },
  }
}

export type CP<UIProps, ExcludeKeys extends keyof UIProps = never, HookArg = any> = ControlledProps<
  UIProps,
  ExcludeKeys,
  HookArg
>
export type ControlledProps<UIProps, ExcludeKeys extends keyof UIProps = never, HookArg = any> = { key?: CKey } & (
  | CtrlHookWrap<UIProps, ExcludeKeys, HookArg>
  | UIProps
)

export type CtrlHookWrap<UIProps, ExcludeKeys extends keyof UIProps = never, HookArg = unknown> = {
  [s]: CtrlHookBag<UIProps, ExcludeKeys, HookArg>
}
export type CtrlHookBag<UIProps, ExcludeKeys extends keyof UIProps = never, HookArg = unknown> = {
  useCtrlHook: CtrlHook<UIProps, HookArg, ExcludeKeys>
  hookArg: HookArg
}

const defaultCtrlHookRetOpts: CtrlHookRetOpts = {
  wrap: _ => _,
}
export const RenderWithHook: FC<{
  chw: CtrlHookWrap<any>
  UIComp: ComponentType<any>
  displayName: string
}> = ({ UIComp, chw, displayName, ...rest }) => {
  const { useCtrlHook, hookArg } = chw[CTRL_SYMB]
  const hookRet = useCtrlHook(hookArg)
  if (!hookRet) {
    return null
  }
  const [feedProps, opts] = hookRet
  const { wrap } = { ...defaultCtrlHookRetOpts, ...opts }
  UIComp.displayName = `${displayName}_UI`
  return wrap(<UIComp {...feedProps} {...rest} />)
}

export const withCtrl = <UIProps, ExcludeKeys extends keyof UIProps = never>(
  UIComp: ComponentType<UIProps>,
): FC<ControlledProps<UIProps, ExcludeKeys>> => {
  // eslint-disable-next-line no-eval
  const Render = ({ children, ...props }: PropsWithChildren<ControlledProps<UIProps, ExcludeKeys>>) => {
    if (CTRL_SYMB in props && (props as any)[CTRL_SYMB]) {
      // console.log('RenderWithHook', props)
      return (
        <RenderWithHook
          {...{
            chw: props as PropsWithChildren<CtrlHookWrap<UIProps>>,
            displayName: Render.displayName,
            UIComp,
          }}
        >
          {children}
        </RenderWithHook>
      )
    } else {
      return <UIComp {...(props as PropsWithChildren<UIProps>)}>{children}</UIComp>
    }
  }
  Render.displayName = ''
  return Render
}
type CKey = string | number | null | undefined

// // eslint-disable-next-line no-eval
// const evalRender =(name:string)=> eval(
//   `function ${name}_Ctrl}({ children, ...props })  {
//     if (CTRL_SYMB in props && props[CTRL_SYMB]) {
//       return <RenderWithHook {...{ chw: props as PropsWithChildren<CtrlHookWrap<UIProps>>, UIComp, children }} />
//     } else {
//       return <UIComp {...(props as PropsWithChildren<UIProps>)} />
//     }
//   }`)
