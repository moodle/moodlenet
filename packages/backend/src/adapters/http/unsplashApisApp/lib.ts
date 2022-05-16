import { AssetRefInput } from '@moodlenet/common/dist/graphql/types.graphql.gen'
import nlcst from 'nlcst-to-string'
import retext from 'retext'
import retextKeywords from 'retext-keywords'
import retextPos from 'retext-pos'
import { createApi } from 'unsplash-js'
import { Basic, Random } from 'unsplash-js/dist/methods/photos/types'

const parseUnsplashImage = (photo: Basic | Random): AssetRefInput => {
  return {
    type: 'ExternalUrl',
    location: photo.urls.regular,
    credits: {
      owner: {
        name: photo.user.first_name,
        url: photo.user.links.html,
      },
      provider: {
        name: 'Unsplash',
        url: 'https://unsplash.com/?utm_source=moodlenet&utm_medium=referral',
      },
    },
  }
}
const getRandomUnsplashImage = ({
  accessKey,
  query,
}: {
  accessKey: string
  query: string
}): Promise<Random | undefined> => {
  const unsplash = createApi({
    accessKey,
    //...other fetch options
  })
  return unsplash.photos
    .getRandom({
      query: query,
      orientation: 'landscape',
    })
    .then((result: any) => {
      if (result.type === 'success' && !Array.isArray(result.response)) {
        // console.log({ result })
        return result.response
      } else {
        return undefined
      }
    })
    .catch((e: any) => {
      console.error(e)
      throw e
    })
}

//  const getFirstWord = (word: string) => {npm i retext-pos
//   const array = word.split(' ')
//   return array[0] ? array[0] : ''
// }

const getKeywords = (text: string): Promise<{ keywords: string[]; keyPhrases: string[] }> => {
  return (
    retext()
      .use(retextPos) // Make sure to use `retext-pos` before `retext-keywords`.
      .use(retextKeywords)
      .process(text)
      // .process(VFile(text))
      // .process((...args: any[]) => {
      //   console.log({ args })
      //   return VFile(text)
      // })
      .then((file: any) => {
        console.log({ file, text })
        const keywords = (file.data.keywords as any).map((keyword: any) => {
          return (nlcst as any)(keyword.matches[0].node)
        })
        const keyPhrases = (file.data.keyphrases as any).map((phrase: any) => {
          return phrase.matches[0].nodes.map((d: any) => (nlcst as any)(d)).join('')
        })
        return { keywords, keyPhrases }
      })
  )
}
export const getUnsplashImages = ({
  query,
  page,
  accessKey,
}: {
  query: string
  page: number
  accessKey: string
}): Promise<(AssetRefInput & { location: string; height: number; width: number })[] | undefined> => {
  const unsplash = createApi({
    accessKey,
    //...other fetch options
  })
  return unsplash.search
    .getPhotos({
      query: query,
      orientation: 'landscape',
      perPage: 30,
      page: page,
    })
    .then((result: any) => {
      // throw new Error('max request exceeded')
      if (result.type === 'success' && !Array.isArray(result.response)) {
        return result.response.results.map((_: Basic | Random) => {
          return { ...parseUnsplashImage(_), width: _.width, height: _.height }
        })
      } else {
        return undefined
      }
    })
}
export const getImageFromKeywords = async ({
  accessKey,
  name,
  description,
  subject,
}: {
  accessKey: string
  name: string
  description: string
  subject?: string
}): Promise<AssetRefInput | null> => {
  const getPhoto = async (keys: string[]): Promise<Random | undefined> => {
    let result = undefined
    let i = 0
    while (result === undefined && i < keys.length) {
      const key = keys[i]
      result = key
        ? await getRandomUnsplashImage({ accessKey, query: key }).then(photo => {
            return photo
          })
        : undefined
      i++
    }
    return result
  }

  const getKeywordPhotos = async (text: string): Promise<Random | undefined> => {
    return getKeywords(text).then(async k => {
      console.log({ k })

      const keywords = [k.keyPhrases, k.keywords]
      let result = undefined
      let i = 0
      while (i < keywords.length && result === undefined) {
        const keys = keywords[i]
        result =
          keys && keys.length > 0
            ? await getPhoto(keys).then(photo => {
                if (photo) {
                  return photo
                }
                return undefined
              })
            : undefined
        i++
      }
      return result
    })
  }

  const queries = [name, description, subject && [subject], subject && subject.split('')]

  let result = undefined
  let i = 0
  while (i < queries.length && result === undefined) {
    const key = queries[i]
    const getPhotoPromise = key ? (typeof key === 'string' ? getKeywordPhotos(key) : getPhoto(key)) : undefined

    result =
      getPhotoPromise &&
      (await getPhotoPromise.then(photo => {
        if (photo) {
          return photo
        }
        return undefined
      }))
    i++
  }
  return (result && parseUnsplashImage(result)) ?? null
}
// console.log(inspect({ retext, retextPos, retextKeywords, VFile, nlcst }, true, 5, true))
