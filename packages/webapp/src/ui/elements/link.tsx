import {
  AnchorHTMLAttributes,
  ComponentType,
  CSSProperties,
  DetailedHTMLProps,
} from 'react'
import { createCtx } from '../../lib/context'
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
export type LinkComponentType = ComponentType<LinkComponentElementProps>

export const Link: LinkComponentType = (props) => {
  const LinkComp = useLinkComponentCtx()
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

export const [useLinkComponentCtx, ProvideLinkComponentCtx] =
  createCtx<LinkComponentType>('LinkComponentCtx')

export const href = (url: string, ext = false): Href => ({
  ext,
  url,
})
