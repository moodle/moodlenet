import type { ComponentType, JSXElementConstructor, ReactElement } from 'react'
import { isValidElement } from 'react'
const PROXY_VALUE_SYMB: unique symbol = `
***
PROXY SYMBOL
holding {
  useProxyProps: ProxyPropsHook<AwaitedProps, ProxyPropsHookArgs>
  proxyPropsHookArgs: ProxyPropsHookArgs
}
***
` as any

export type ProxyProps<AwaitedProps> = ProxyPropsValue<AwaitedProps, any[]> | AwaitedProps

type ProxyPropsValue<AwaitedProps, ProxyPropsHookArgs extends any[] = any[]> = {
  [PROXY_VALUE_SYMB]: {
    useProxyProps: ProxyPropsHook<AwaitedProps, ProxyPropsHookArgs>
    proxyPropsHookArgs: ProxyPropsHookArgs
  }
}

export type ProxyPropsHook<ProxiedProps, ProxyPropsHookArgs extends any[]> = (
  ...proxyPropsArgs: ProxyPropsHookArgs
) => ProxyPropsResult<ProxiedProps>

export type ProxyPropsResult<ProxiedProps> =
  | ProxiedProps
  | [feedProps: ProxiedProps, opts?: Partial<ProxyPropsValueOpts<ProxiedProps>>]
  | ReactElement
  | null

export type ProxyPropsValueOpts<ProxiedProps = any> = {
  wrap(
    ui: ReactElement<ProxiedProps, JSXElementConstructor<ProxiedProps>>,
  ): ReactElement<ProxiedProps, JSXElementConstructor<ProxiedProps>>
}

export function proxyProps<ProxiedProps, ProxyPropsHookArgs extends any[]>(
  useProxyProps: ProxyPropsHook<ProxiedProps, ProxyPropsHookArgs>,
  ...proxyPropsHookArgs: ProxyPropsHookArgs
): ProxyProps<ProxiedProps> {
  return {
    [PROXY_VALUE_SYMB]: {
      proxyPropsHookArgs,
      useProxyProps,
    },
  } as ProxyProps<ProxiedProps>
}

const defaultProxyPropsValueOpts: ProxyPropsValueOpts = { wrap: _ => _ }

ProxyPropsRender.displayName = 'Proxy-Renderer'
function ProxyPropsRender({
  Component,
  givenProps,
}: {
  givenProps: ProxyPropsValue<any>
  Component: ComponentType<any>
}) {
  const { useProxyProps, proxyPropsHookArgs } = givenProps[PROXY_VALUE_SYMB]
  const proxyPropsValue = useProxyProps(...proxyPropsHookArgs)
  if (!proxyPropsValue) {
    return null
  } else if (isValidElement(proxyPropsValue)) {
    return proxyPropsValue
  }
  const [proxiedProps, opts] = Array.isArray(proxyPropsValue) ? proxyPropsValue : [proxyPropsValue]
  const { wrap } = { ...defaultProxyPropsValueOpts, ...opts } as ProxyPropsValueOpts

  return wrap(<Component {...proxiedProps} {...givenProps} />)
}

export function proxied<ComponentProps extends Record<string, any>>(
  Component: ComponentType<ComponentProps>,
  displayName?: string,
) {
  const componentDisplayName = displayName ?? Component.displayName ?? Component.name ?? 'Unnamed'
  Component.displayName = componentDisplayName
  ProxyComponent.displayName = `${componentDisplayName}-Proxy`
  return ProxyComponent

  function ProxyComponent<
    StaticProps extends Partial<ComponentProps>,
    AwaitedProps extends Omit<ComponentProps, keyof StaticProps>,
  >(
    givenProps: [AwaitedProps] extends [never]
      ? never
      :
          | ComponentProps
          | (StaticProps & AwaitedProps extends ComponentProps
              ? StaticProps & ProxyProps<AwaitedProps>
              : never),
  ): ReactElement<ComponentProps, JSXElementConstructor<ComponentProps>> | null {
    if (isProxyPropsHookValue(givenProps)) {
      return <ProxyPropsRender givenProps={givenProps} Component={Component} />
    } else {
      return <Component {...(givenProps as ComponentProps)} />
    }
  }
}

function isProxyPropsHookValue(props: any): props is ProxyPropsValue<any> {
  return !!(props ?? ({} as any))[PROXY_VALUE_SYMB]
}
