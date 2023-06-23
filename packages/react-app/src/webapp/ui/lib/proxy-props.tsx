import type { ComponentType, JSXElementConstructor, ReactElement } from 'react'

export type { ComponentType, JSXElementConstructor, ReactElement } from 'react'
// import { isValidElement } from 'react'
const PROXY_VALUE_SYMB: unique symbol = `
***
PROXY SYMBOL
holding {
  useProxyProps: ProxyPropsHook<AwaitedProps>
}
***
` as any

export type ProxyProps<AwaitedProps> = DeferedProps<AwaitedProps> | AwaitedProps

type DeferedProps<AwaitedProps> = {
  [PROXY_VALUE_SYMB]: {
    usePropProxy: PropsProxyHook<AwaitedProps>
  }
}

export type PropsProxyHook<AwaitedProps> = () => PropsProxyHookResult<AwaitedProps>

export type PropsProxyHookResult<AwaitedProps> = {
  props: AwaitedProps | null
  opts?: Partial<PropsProxyHookResultOpts>
} | null
// | ReactElement

export type PropsProxyHookResultOpts = {
  Wrapper: ComponentType<{ element: ReactElement }>
}

export function proxyWith<AwaitedProps>(
  usePropProxy: PropsProxyHook<AwaitedProps>,
): ProxyProps<AwaitedProps> {
  return {
    [PROXY_VALUE_SYMB]: {
      usePropProxy,
    },
  }
}

ProxyPropsRender.displayName = 'ProxyPropsRender'
function ProxyPropsRender({
  Component,
  givenProps,
}: {
  givenProps: DeferedProps<any>
  Component: ComponentType<any>
}) {
  const { usePropProxy } = givenProps[PROXY_VALUE_SYMB]
  const propsProxyHookResult = usePropProxy()
  if (!propsProxyHookResult?.props) {
    return null
  }
  //else if (isValidElement(propsProxyHookResult)) {
  //   return propsProxyHookResult
  // }
  const { props: awaitedProps, opts } = propsProxyHookResult
  const element = <Component {...awaitedProps} {...givenProps} />
  return opts?.Wrapper ? <opts.Wrapper element={element} /> : element
}

export function withProxy<ComponentProps extends Record<string, any>>(
  Component: ComponentType<ComponentProps>,
  displayName?: string,
) {
  const componentDisplayName = displayName ?? Component.displayName ?? Component.name ?? 'Unnamed'
  Component.displayName = componentDisplayName
  ProxyComponent.displayName = `${componentDisplayName}-Proxy`
  return ProxyComponent

  function ProxyComponent<
    GivenProps extends Partial<ComponentProps>,
    AwaitedProps extends Omit<ComponentProps, keyof GivenProps>,
  >(
    givenProps: [AwaitedProps] extends [never]
      ? never
      :
          | ComponentProps
          | (GivenProps & AwaitedProps extends ComponentProps
              ? GivenProps & ProxyProps<AwaitedProps>
              : never),
  ): ReactElement<ComponentProps, JSXElementConstructor<ComponentProps>> {
    if (isPropsProxyHookValue(givenProps)) {
      return <ProxyPropsRender givenProps={givenProps} Component={Component} />
    } else {
      return <Component {...(givenProps as ComponentProps)} />
    }
  }
}

function isPropsProxyHookValue(props: any): props is DeferedProps<any> {
  return !!(props ?? ({} as any))[PROXY_VALUE_SYMB]
}
