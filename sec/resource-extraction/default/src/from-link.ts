import { tikaExtractAsset } from '@moodle/lib-asset-extraction-tika'
import { URL } from 'url'
import { assetExtractor } from './types'

export const extractTextFromLink: assetExtractor<'external'> = async ({ asset, env }) => {
  const linkUrl = asset.url
  const domain = new URL(linkUrl).hostname
  const domainExtractor: Record<string, assetExtractor<'external'>> = {}

  const extractor = domainExtractor[domain]
  return extractor ? extractor({ env, asset }) : tikaExtractAsset({ asset, tikaUrl: env.tikaUrl })
}
