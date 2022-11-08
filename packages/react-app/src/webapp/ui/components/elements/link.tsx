import {
  AnchorHTMLAttributes,
  ComponentType,
  createContext,
  CSSProperties,
  DetailedHTMLProps,
  FC,
  PropsWithChildren,
  useContext,
} from 'react'

export type Href = {
  ext: boolean
  url: string
}

export type LinkComponentElementProps = DetailedHTMLProps<
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: Href
    asExt?: boolean
  },
  HTMLAnchorElement
> & {
  exact?: boolean
  strict?: boolean
  activeClassName?: string
  activeStyle?: CSSProperties
  externalClassName?: string
  externalStyle?: CSSProperties
}
export type LinkComponentType = ComponentType<PropsWithChildren<LinkComponentElementProps>>

export const Link: LinkComponentType = props => {
  const { LinkComp } = useContext(LinkComponentCtx)
  return <LinkComp {...props}>{props.children}</LinkComp>
}

// const DefaultLinkComp: LinkComponentType = props => {
//   const isExternal = props.href.ext
//   const { href, externalClassName, externalStyle, activeClassName, activeStyle, exact, strict, ...restProps } = props
//   const extProps = isExternal
//     ? {
//         className: externalClassName,
//         style: externalStyle,
//         target: '_blank',
//         rel: 'noopener noreferrer',
//       }
//     : null
//   return (
//     <a {...extProps} {...restProps} href={href.url}>
//       {props.children}
//     </a>
//   )
// }

export type LinkComponentCtxType = { LinkComp: LinkComponentType }
export const LinkComponentCtx = createContext<LinkComponentCtxType>(null as any)
export const href = (url: string, ext = false): Href => ({
  ext,
  url,
})

const ctxValue: LinkComponentCtxType = { LinkComp: Link }
export const ProvideLinkComponentCtx: FC<PropsWithChildren> = ({ children }) => {
  return <LinkComponentCtx.Provider value={ctxValue}>{children}</LinkComponentCtx.Provider>
}
