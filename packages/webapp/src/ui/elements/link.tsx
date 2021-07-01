import { AnchorHTMLAttributes, ComponentType, createContext, CSSProperties, DetailedHTMLProps, useContext } from 'react'
export type Href = {
  ext: boolean
  url: string
}
export type LinkComponentElementProps = DetailedHTMLProps<
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: Href; asExt?: boolean },
  HTMLAnchorElement
> & {
  activeClassName?: string
  activeStyle?: CSSProperties
  externalClassName?: string
  externalStyle?: CSSProperties
}
export type LinkComponentType = ComponentType<LinkComponentElementProps>

export const Link: LinkComponentType = props => {
  const LinkComp = useContext(LinkComponentCtx)
  return <LinkComp {...props}>{props.children}</LinkComp>
}

const DefaultLinkComp: LinkComponentType = props => {
  const isExternal = props.href.ext
  const { href, externalClassName, externalStyle, activeClassName, activeStyle, ...restProps } = props
  const extProps = isExternal
    ? {
        className: externalClassName,
        style: externalStyle,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : null
  return (
    <a {...extProps} {...restProps} href={href.url}>
      {props.children}
    </a>
  )
}

export const LinkComponentCtx = createContext<LinkComponentType>(DefaultLinkComp)

export const href = (url: string, ext = false): Href => ({
  ext,
  url,
})
