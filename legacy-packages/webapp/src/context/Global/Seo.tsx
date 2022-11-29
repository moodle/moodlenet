import { nodeGqlId2UrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { FC, useEffect, useMemo, useReducer } from 'react'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router'
import { createCtx } from '../../lib/context'
import { LocalInstanceContextType, useLocalInstance } from './LocalInstance'
import { useSeoContentQuery } from './Seo/Seo.gen'

// TODO: implement Open Graph protocol : https://ogp.me/

export type SeoMeta = {
  robotsMeta: RobotsMeta[]
  title: string
  description: string
  canonicalUrl: string
}
export type SeoContextType = {
  updateSeoMeta(meta: Partial<SeoMeta>): unknown
  seoMeta: SeoMeta
}
const orgSeoMeta = ({ org }: { org: LocalInstanceContextType['org'] }) => {
  const currentBrowserUrl = window.location.href
  const meta: SeoMeta = {
    robotsMeta: defaultRobotsMeta,
    canonicalUrl: currentBrowserUrl,
    description: org.description,
    title: `${org.name} - ${org.subtitle}`,
  }
  return meta
}

export const [useSeo, ProvideSeo] = createCtx<SeoContextType>('Seo')
export const defaultRobotsMeta: RobotsMeta[] = [
  'max-image-preview: standard',
  'all',
]
export const SeoProvider: FC = ({ children }) => {
  const { org } = useLocalInstance()
  const { listen } = useHistory()

  const [seoMeta, updateSeoMeta] = useReducer(
    (prev: SeoMeta, next: Partial<SeoMeta>) => {
      return {
        ...prev,
        ...next,
      }
    },
    orgSeoMeta({ org })
  )

  useEffect(
    () => listen(() => updateSeoMeta(orgSeoMeta({ org }))),
    [listen, org]
  )

  const ctx = useMemo<SeoContextType>(() => {
    return {
      updateSeoMeta,
      seoMeta,
    }
  }, [seoMeta, updateSeoMeta])

  return (
    <ProvideSeo value={ctx}>
      <Helmet
        titleTemplate={`%s | ${org.name}`}
        defaultTitle={`${org.name} | ${org.subtitle}`}
      >
        <title>{seoMeta.title}</title>
        <meta
          name="description"
          content={seoMeta.description || seoMeta.title}
        />
        <meta name="robots" content={seoMeta.robotsMeta.join(', ')} />
        <meta name="theme-color" content={org.color} />
        <link rel="canonical" href={seoMeta.canonicalUrl} />
      </Helmet>
      {children}
    </ProvideSeo>
  )
}

export const useSeoContentId = (id: string) => {
  const { org } = useLocalInstance()
  const { updateSeoMeta } = useSeo()
  const seoContentQRes = useSeoContentQuery({ variables: { id } })

  useEffect(() => {
    const node = seoContentQRes.data?.node
    if (!node) {
      updateSeoMeta(orgSeoMeta({ org }))
      return
    }
    updateSeoMeta({
      canonicalUrl: `${window.location.origin}${nodeGqlId2UrlPath(node.id)}`,
      description: node.description,
      title: node.name,
      robotsMeta: defaultRobotsMeta,
    })
  }, [org, seoContentQRes.data?.node, updateSeoMeta])
}

//https://developers.google.com/search/docs/advanced/robots/robots_meta_tag#directives
export type MaxImagePreview = `none` | `standard` | `large`
export type UnavailableAfter = string
export type RobotsMeta =
  | `none`
  | `all`
  | `nosnippet`
  | `noarchive`
  | `nofollow`
  | `noindex`
  | `notranslate`
  | `noimageindex`
  | `max-snippet: ${number}`
  | `max-image-preview: ${MaxImagePreview}`
  | `max-video-preview: ${number}`
  | `unavailable_after: ${UnavailableAfter}`
