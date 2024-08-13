import {
  ComponentType,
  FC,
  isValidElement,
  PropsWithChildren,
  ReactElement,
} from 'react'

export type UIPropsOf<
  UIProps,
  ExcludeKeys extends keyof UIProps = never
> = Pick<UIProps, ExcludeKeys>
declare const s: unique symbol
const CTRL_SYMB: typeof s = `___CTRL_SYMBOL___${Number(
  `${Math.random()}`.substring(2)
).toString(36)}` as any

export type CtrlHook<
  UIProps,
  HookArg,
  ExcludeKeys extends keyof UIProps = never
> = (hookArg: HookArg) => CtrlHookRetOf<UIProps, ExcludeKeys>

export type Wrapper<C = ComponentType<any>> = C extends ComponentType<infer T>
  ? [ComponentType<T>, T]
  : never
export type CtrlHookRetOf<UIProps, ExcludeKeys extends keyof UIProps = never> =
  | [feedProps: Omit<UIProps, ExcludeKeys>, opts?: Partial<CtrlHookRetOpts>]
  | null
  | undefined
  | ReactElement

export type CtrlHookRetOpts = {
  wrap(ui: ReactElement): ReactElement
}

export const ctrlHook = <
  UIProps,
  HookArg,
  ExcludeKeys extends keyof UIProps = never
>(
  useCtrlHook: CtrlHook<UIProps, HookArg, ExcludeKeys>,
  hookArg: HookArg,
  key: CKey
): ControlledProps<UIProps, ExcludeKeys, HookArg> => {
  return {
    key,
    [CTRL_SYMB]: {
      useCtrlHook,
      hookArg,
    },
  }
}

export type CP<
  UIProps,
  ExcludeKeys extends keyof UIProps = never,
  HookArg = any
> = ControlledProps<UIProps, ExcludeKeys, HookArg>
export type ControlledProps<
  UIProps,
  ExcludeKeys extends keyof UIProps = never,
  HookArg = any
> = { key?: CKey } & (CtrlHookWrap<UIProps, ExcludeKeys, HookArg> | UIProps)

export type CtrlHookWrap<
  UIProps,
  ExcludeKeys extends keyof UIProps = never,
  HookArg = unknown
> = {
  [s]: CtrlHookBag<UIProps, ExcludeKeys, HookArg>
}
export type CtrlHookBag<
  UIProps,
  ExcludeKeys extends keyof UIProps = never,
  HookArg = unknown
> = {
  useCtrlHook: CtrlHook<UIProps, HookArg, ExcludeKeys>
  hookArg: HookArg
}

const defaultCtrlHookRetOpts: CtrlHookRetOpts = {
  wrap: (_) => _,
}
export const RenderWithHook: FC<{
  chw: CtrlHookWrap<any>
  UIComp: ComponentType<any>
  name: string
  key?: CKey
}> = ({ UIComp, chw, name, key, children }) => {
  const { useCtrlHook, hookArg } = chw[CTRL_SYMB]
  const hookRet = useCtrlHook(hookArg)
  if (!hookRet) {
    return null
  } else if (isValidElement(hookRet)) {
    return hookRet
  }
  const [feedProps, opts] = hookRet
  const { wrap } = { ...defaultCtrlHookRetOpts, ...opts }
  UIComp.displayName = `${name}_UI`

  return wrap(
    <UIComp key={key} {...feedProps} {...chw}>
      {children}
    </UIComp>
  )
}

export type WithCtrlProps<
  UIProps,
  ExcludeKeys extends keyof UIProps = never
> = ControlledProps<UIProps, ExcludeKeys> & Pick<UIProps, ExcludeKeys>
export const withCtrl = <UIProps,>(
  UIComp: ComponentType<UIProps>
): {
  <ExcludeKeys extends never | keyof UIProps>(
    props: PropsWithChildren<WithCtrlProps<UIProps, ExcludeKeys>>,
    context?: any
  ): ReactElement<any, any> | null
  displayName?: string
  defaultProps?: Partial<UIProps>
} => {
  // eslint-disable-next-line no-eval
  const Render = <ExcludeKeys extends never | keyof UIProps>({
    children,
    ...props
  }: PropsWithChildren<ControlledProps<UIProps, ExcludeKeys>>) => {
    if (CTRL_SYMB in props && (props as any)[CTRL_SYMB]) {
      // console.log('RenderWithHook', props)
      return (
        <RenderWithHook
          chw={props as PropsWithChildren<CtrlHookWrap<UIProps>>}
          name={Render.name}
          UIComp={UIComp}
          key={props.key} //FIXME: check how to propagate key properly
        >
          {children}
        </RenderWithHook>
      )
    } else {
      return (
        <UIComp {...(props as PropsWithChildren<UIProps>)}>{children}</UIComp>
      )
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
