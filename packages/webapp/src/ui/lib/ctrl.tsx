import { ComponentType, FC } from 'react'

export type Ctrl<
  UIProps extends object,
  IntrinsicCtrlProps extends InternalCtrlProps<UIProps>,
  ExclKeys extends keyof UIProps = never
> = ComponentType<CtrlPropsFor<UIProps, IntrinsicCtrlProps, ExclKeys>>

export type UICtrl<
  UIProps extends object,
  ExclKeys extends keyof UIProps = never,
  IntrinsicCtrlProps extends InternalCtrlProps<UIProps> = UnknownIntrinsicCtrlProps<UIProps>
> = ComponentType<UICtrlPropsFor<UIProps, ExclKeys, IntrinsicCtrlProps> & InternalCtrlProps<UIProps>>

export type CtrlPropsFor<
  UIProps extends object,
  IntrinsicCtrlProps extends InternalCtrlProps<UIProps>,
  ExclKeys extends keyof UIProps = never
> = UICtrlPropsFor<UIProps, ExclKeys, IntrinsicCtrlProps>

export type InternalCtrlProps<UIProps> = { __uiComp: ComponentType<UIProps>; __key: string }

export type UICtrlPropsFor<
  UIProps extends object,
  ExclKeys extends keyof UIProps = never,
  IntrinsicCtrlProps extends InternalCtrlProps<UIProps> = UnknownIntrinsicCtrlProps<UIProps>
> = Pick<UIProps, ExclKeys> & InternalCtrlProps<UIProps> & IntrinsicCtrlProps

const UnknownIntrinsicCtrlProp = Symbol()
type UnknownIntrinsicCtrlProps<UIProps extends object> = {
  readonly [UnknownIntrinsicCtrlProp]: unique symbol
} & InternalCtrlProps<UIProps>

export type WithProps<
  UIProps extends object,
  ExclKeys extends keyof UIProps = never,
  IntrinsicCtrlProps extends InternalCtrlProps<UIProps> = UnknownIntrinsicCtrlProps<UIProps>
> = (
  UICmp: ComponentType<UIProps>,
) => readonly [UICtrl: UICtrl<UIProps, ExclKeys, IntrinsicCtrlProps>, intrinsicCtrlProps: IntrinsicCtrlProps]

export type WithPropsList<
  UIProps extends object,
  ExclKeys extends keyof UIProps = never,
  IntrinsicCtrlProps extends InternalCtrlProps<UIProps> = UnknownIntrinsicCtrlProps<UIProps>
> = (
  UICmp: ComponentType<UIProps>,
) => readonly [UICtrl: UICtrl<UIProps, ExclKeys, IntrinsicCtrlProps>, intrinsicCtrlProps: readonly IntrinsicCtrlProps[]]

type BaseIntrinsicCtrlProps = { key: string }
export type CtrlProps<IntrinsicProps> = IntrinsicProps & BaseIntrinsicCtrlProps
export const createWithProps = <
  UIProps extends object,
  IntrinsicCtrlProps extends object,
  ExclKeys extends keyof UIProps = never
>(
  CtrlCmp: Ctrl<UIProps, IntrinsicCtrlProps & InternalCtrlProps<UIProps>, ExclKeys>,
) => {
  // const UICtrlCmp: UICtrl<UIProps, ExclKeys, IntrinsicCtrlProps & InternalCtrlProps<UIProps>> = uiCtrlProps => (
  //   <CtrlCmp {...uiCtrlProps} />
  // )
  const UICtrlCmp = CtrlCmp
  return [
    UICtrlCmp,
    function withProps(intrinsicCtrlProps: IntrinsicCtrlProps & BaseIntrinsicCtrlProps): WithProps<UIProps, ExclKeys> {
      return __uiComp => {
        // ): WithProps<UIProps, ExclKeys, IntrinsicCtrlProps & InternalCtrlProps<UIProps>> => __uiComp => {
        type ActualType = ReturnType<WithProps<UIProps, ExclKeys, IntrinsicCtrlProps & InternalCtrlProps<UIProps>>>
        const ctrlProps: IntrinsicCtrlProps & InternalCtrlProps<UIProps> = {
          ...intrinsicCtrlProps,
          __uiComp,
          __key: intrinsicCtrlProps.key,
        }
        const _: ActualType = [CtrlCmp, ctrlProps]
        return _ as any
      }
    },
    function withPropsList(
      intrinsicCtrlPropsList: (IntrinsicCtrlProps & BaseIntrinsicCtrlProps)[],
    ): WithPropsList<UIProps, ExclKeys> {
      return __uiComp => {
        // ): WithPropsList<UIProps, ExclKeys, IntrinsicCtrlProps & InternalCtrlProps<UIProps>> => __uiComp => {
        type ActualType = ReturnType<WithPropsList<UIProps, ExclKeys, IntrinsicCtrlProps & InternalCtrlProps<UIProps>>>

        const ctrlPropsList = intrinsicCtrlPropsList.map<IntrinsicCtrlProps & InternalCtrlProps<UIProps>>(
          intrinsicCtrlProps => ({
            ...intrinsicCtrlProps,
            __uiComp,
            __key: intrinsicCtrlProps.key,
          }),
        )
        const _: ActualType = [CtrlCmp, ctrlPropsList]
        return _ as any
      }
    },
  ] as const
}

const IdCtrl: FC<{ __uiComp: FC }> = ({ __uiComp: Cmp, ...rest }) => <Cmp {...rest} />

export const withPropsStatic = <UIProps extends object, ExclKeys extends keyof UIProps = never>(
  uiProps: UIProps & { key?: string },
): WithProps<UIProps, ExclKeys> => __uiComp => [IdCtrl, { ...uiProps, __uiComp }] as any

// new Proxy(() => {}, {
//   apply(target, _th, args) {
//     const [__uiComp] = args
//     console.log({ __uiComp, target })
//     return [IdCtrl, { ...uiProps, __uiComp }]
//   },
//   getOwnPropertyDescriptor(_target, prop) {
//     return {
//       configurable: true,
//       enumerable: true,
//       value: (uiProps as any)[prop],
//       writable: false,
//     }
//   },
//   get(_tgt, p) {
//     return (uiProps as any)[p]
//   },
//   getPrototypeOf() {
//     return Object
//   },
//   ownKeys() {
//     return Object.keys(uiProps)
//   },
// }) as any

/* {
  const it = function* () {
    yield IdCtrl
    yield uiProps
  }
  ;(uiProps as any)[Symbol.iterator] = it
  return ()=>({
    [Symbol.iterator]:function* () {
      yield IdCtrl
      yield uiProps
    }
  }) as any
} */
// export const withPropsStatic = <UIProps extends object, ExclKeys extends keyof UIProps = never>(
//   uiProps: UIProps & { key?: string },
// ): WithProps<UIProps, ExclKeys> => {
//   const UICtrlCmp: UICtrl<UIProps, ExclKeys, any> = ctrlProps => {
//     const { children, __key, __uiComp: UICmp, ...restProps } = ctrlProps
//     return (
//       <UICmp {...uiProps} key={__key} {...restProps}>
//         {ctrlProps.children}
//       </UICmp>
//     )
//       }
//   const [, withProps] = createWithProps<UIProps, any, ExclKeys>(UICtrlCmp)
//   return withProps({ ...uiProps, key: uiProps.key ?? `${Math.random()}` })
// }

// export const withPropsListStatic = <UIProps extends object, ExclKeys extends keyof UIProps = never>(
//   uiProps: (UIProps & { key?: string })[],
// ): WithPropsList<UIProps, ExclKeys> => {
//   const UICtrlCmp: UICtrl<UIProps, ExclKeys, any> = ctrlProps => {
//     const { children, __key, __uiComp: UICmp, ...restProps } = ctrlProps
//     return (
//       <UICmp {...uiProps} key={__key} {...restProps}>
//         {ctrlProps.children}
//       </UICmp>
//     )
//   }
//   const [, , withPropsList] = createWithProps<UIProps, any, ExclKeys>(UICtrlCmp)
//   return withPropsList(uiProps.map((_, index) => ({ ..._, key: _.key ?? `${index}` })))
// }

export const withPropsListStatic = <UIProps extends object, ExclKeys extends keyof UIProps = never>(
  uiPropsList: (UIProps & { key?: string })[],
): WithPropsList<UIProps, ExclKeys> => __uiComp =>
  [IdCtrl, uiPropsList.map(uiProps => ({ ...uiProps, __uiComp }))] as any
