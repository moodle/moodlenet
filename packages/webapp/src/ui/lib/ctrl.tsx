import { ComponentType } from 'react'

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

export const createWithProps = <
  UIProps extends object,
  IntrinsicCtrlProps extends object,
  ExclKeys extends keyof UIProps = never
>(
  CtrlCmp: Ctrl<UIProps, IntrinsicCtrlProps & InternalCtrlProps<UIProps>, ExclKeys>,
) => {
  const UICtrlCmp: UICtrl<UIProps, ExclKeys, IntrinsicCtrlProps & InternalCtrlProps<UIProps>> = uiCtrlProps => (
    <CtrlCmp {...uiCtrlProps} />
  )

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
        const _: ActualType = [UICtrlCmp, ctrlProps]
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
        const _: ActualType = [UICtrlCmp, ctrlPropsList]
        return _ as any
      }
    },
  ] as const
}

export const withPropsStatic = <UIProps extends object, ExclKeys extends keyof UIProps = never>(
  uiProps: UIProps & { key?: string },
): WithProps<UIProps, ExclKeys> => {
  const UICtrlCmp: UICtrl<UIProps, ExclKeys, any> = ctrlProps => {
    const { children, __key, __uiComp: UICmp, ...restProps } = ctrlProps
    return (
      <UICmp {...uiProps} key={__key} {...restProps}>
        {ctrlProps.children}
      </UICmp>
    )
  }
  const [, withProps] = createWithProps<UIProps, any, ExclKeys>(UICtrlCmp)
  return withProps({ ...uiProps, key: uiProps.key ?? `${Math.random()}` })
}

export const withPropsListStatic = <UIProps extends object, ExclKeys extends keyof UIProps = never>(
  uiProps: (UIProps & { key?: string })[],
): WithPropsList<UIProps, ExclKeys> => {
  const UICtrlCmp: UICtrl<UIProps, ExclKeys, any> = ctrlProps => {
    const { children, __key, __uiComp: UICmp, ...restProps } = ctrlProps
    return (
      <UICmp {...uiProps} key={__key} {...restProps}>
        {ctrlProps.children}
      </UICmp>
    )
  }
  const [, , withPropsList] = createWithProps<UIProps, any, ExclKeys>(UICtrlCmp)
  return withPropsList(uiProps.map((_, index) => ({ ..._, key: _.key ?? `${index}` })))
}
