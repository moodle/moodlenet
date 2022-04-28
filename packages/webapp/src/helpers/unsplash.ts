import { UNSPLASH_ENDPOINT } from '../constants'
import { AssetRefInput } from '../graphql/pub.graphql.link'

export const getUnsplashImages = async (
  query: string,
  page: number
): Promise<
  (AssetRefInput & { height: number; width: number })[] | undefined
> => {
  if (!UNSPLASH_ENDPOINT) {
    return
  }
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
): Promise<AssetRefInput | null> => {
  if (!UNSPLASH_ENDPOINT) {
    return null
  }

  const params = new URLSearchParams({
    name,
    description,
    subject,
  }).toString()

  const result = await fetch(
    `${UNSPLASH_ENDPOINT}/getImageFromKeywords?${params}`
  ).catch(() => undefined)
  return result?.json()
}
