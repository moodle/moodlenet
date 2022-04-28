import { UNSPLASH_ENDPOINT } from '../constants'
import { AssetInfo } from '../ui/types'

export const getUnsplashImages = async (
  query: string,
  page: number
): Promise<
  | (AssetInfo & { location: string; height: number; width: number })[]
  | undefined
> => {
  const params = new URLSearchParams({
    query,
    page: String(page),
  }).toString()

  const result = await fetch(
    `${UNSPLASH_ENDPOINT}/getUnsplashImages?${params}`
  ).catch(() => undefined)
  return result?.json()
}

export const getImageFromKeywords = async (
  name: string,
  description: string,
  subject = ''
): Promise<(AssetInfo & { location: string }) | undefined> => {
  const params = new URLSearchParams({
    name,
    description,
    subject,
  }).toString()

  const result = await fetch(
    `${UNSPLASH_ENDPOINT}/getImageFromKeywords&${params}`
  ).catch(() => undefined)
  return result?.json()
}
