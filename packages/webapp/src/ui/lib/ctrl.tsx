import { FC } from 'react'

type PickProps<Props, InclKeys extends keyof Props> = Pick<Props, InclKeys>

export type Ctrl<Props, ExclKeys extends keyof Props = never> = FC<
  PickProps<Props, ExclKeys> & {
    _: FC<Props>
    _k: string
  }
>

export type CtrlBag<Props, ExclKeys extends keyof Props = never> = {
  key: string
  Cmp: Ctrl<Props, ExclKeys>
  _k: string
}

export const ctrlBag = <Props, ExclKeys extends keyof Props = never>(
  key: string,
  Cmp: Ctrl<Props, ExclKeys>,
): CtrlBag<Props, ExclKeys> => ({
  key,
  Cmp,
  _k: key,
})

export const sbCtrlBagOf = <Props, ExclKeys extends keyof Props = never>(
  props: Props,
  key = 'key',
): CtrlBag<Props, ExclKeys> => {
  const bag = ({ props } as any) as CtrlBag<Props, ExclKeys>
  const Cmp: Ctrl<Props, ExclKeys> = _props => {
    const { _: Cmp, _k, children, ...restProps } = _props
    return (
      <Cmp {...props} key={_k} {...restProps}>
        {_props.children}
      </Cmp>
    )
  }
  Object.defineProperties(bag, {
    _k: {
      value: key,
      writable: false,
      enumerable: false,
    },
    key: {
      value: key,
      writable: false,
      enumerable: false,
    },
    Cmp: { value: Cmp, writable: false, enumerable: false },
  })
  return bag
}
