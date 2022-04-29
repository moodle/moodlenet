import { UNSPLASH_ENDPOINT } from '../constants'
import { useSession } from '../context/Global/Session'
import { AssetRefInput } from '../graphql/pub.graphql.link'

export const useUnsplash = () => {
  const { lastSessionJwt } = useSession()

  const available = !!(lastSessionJwt && UNSPLASH_ENDPOINT)

  const getUnsplashImages = async (
    query: string,
    page: number
  ): Promise<
    (AssetRefInput & { height: number; width: number })[] | undefined
  > => {
    if (!available) {
      return
    }
    const params = new URLSearchParams({
      query,
      page: String(page),
    }).toString()

    const result = await fetch(
      `${UNSPLASH_ENDPOINT}/getUnsplashImages?${params}`,
      { headers: { bearer: lastSessionJwt } }
    ).catch(() => undefined)
    return result?.json()
  }

  const getImageFromKeywords = async (
    name: string,
    description: string,
    subject = ''
  ): Promise<AssetRefInput | null> => {
    if (!available) {
      return null
    }

    const params = new URLSearchParams({
      name,
      description,
      subject,
    }).toString()

    const result = await fetch(
      `${UNSPLASH_ENDPOINT}/getImageFromKeywords?${params}`,
      { headers: { bearer: lastSessionJwt } }
    ).catch(() => undefined)
    return result?.json()
  }
  return { getUnsplashImages, getImageFromKeywords }
}
