import { toString } from 'nlcst-to-string'
import { retext } from 'retext'
import retextKeywords from 'retext-keywords'
import retextPos from 'retext-pos'
import { createApi } from 'unsplash-js'
import { Basic, Random } from 'unsplash-js/dist/methods/photos/types'
import vfile from 'vfile'
import { ContentBackupImages } from '../ui/assets/data/images'
import { AssetInfo } from '../ui/types'

export const isURL = (str: string): boolean => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ) // fragment locator
  return !!pattern.test(str)
}

export const isEmailAddress = (email: string): boolean => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export const randomIntFromInterval = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const elementFullyInViewPort = (
  el: Element,
  options?: {
    marginTop?: number
  }
): boolean => {
  let { left, top, right, bottom } = el.getBoundingClientRect()

  const height = bottom - top
  const width = right - left
  if (options?.marginTop) {
    top = top - options.marginTop
  }

  return (
    top >= window.pageYOffset &&
    left >= window.pageXOffset &&
    top + height <= window.pageYOffset + window.innerHeight &&
    left + width <= window.pageXOffset + window.innerWidth
  )
}

export const getElementSize = (
  el: Element
): { width: number; height: number } => {
  const { left, top, right, bottom } = el.getBoundingClientRect()
  return {
    width: right - left,
    height: bottom - top,
  }
}

export const adjustColor = (color: string, amount: number) => {
  return (
    '#' +
    color
      .replace(/^#/, '')
      .replace(/../g, (color) =>
        (
          '0' +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  )
}

export const randomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`

export const getNumberFromString = (s: string) =>
  parseInt(
    s
      .split('')
      .map((l) => {
        return l.charCodeAt(0)
      })
      .join(''),
    10
  )

export const getBackupImage = (id: string): AssetInfo | undefined => {
  const numId = getNumberFromString(id)
  return ContentBackupImages[numId % ContentBackupImages.length]
}

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max)
}

export const parseUnsplashImage = (
  photo: Basic | Random
): AssetInfo & { location: string } => {
  return {
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

export const getRandomUnsplashImage = (
  query: string
): Promise<Random | undefined> => {
  const unsplash = createApi({
    accessKey: 'M-Iko8LWeVCJT4DdSFjbWDG0MyYqk8GmI0LoYjVSGrk',
    //...other fetch options
  })
  return unsplash.photos
    .getRandom({
      query: query,
      orientation: 'landscape',
    })
    .then((result) => {
      if (result.type === 'success' && !Array.isArray(result.response)) {
        return result.response
      } else {
        return undefined
      }
    })
}

export const getUnsplashImages = (
  query: string,
  page: number
): Promise<Basic[] | undefined> => {
  const unsplash = createApi({
    accessKey: 'M-Iko8LWeVCJT4DdSFjbWDG0MyYqk8GmI0LoYjVSGrk',
    //...other fetch options
  })
  return unsplash.search
    .getPhotos({
      query: query,
      orientation: 'landscape',
      perPage: 30,
      page: page,
    })
    .then((result) => {
      // throw new Error('max request exceeded')
      if (result.type === 'success' && !Array.isArray(result.response)) {
        return result.response.results
      } else {
        return undefined
      }
    })
}

export const getFirstWord = (word: string) => {
  const array = word.split(' ')
  return array[0] ? array[0] : ''
}

export const getKeywords = (
  text: string
): Promise<{ keywords: string[]; keyPhrases: string[] }> => {
  return retext()
    .use(retextPos) // Make sure to use `retext-pos` before `retext-keywords`.
    .use(retextKeywords)
    .process(vfile(text) as any)
    .then((file: any) => {
      const keywords = file.data.keywords.map((keyword: any) => {
        return toString(keyword.matches[0].node)
      })
      const keyPhrases = file.data.keyphrases.map((phrase: any) => {
        return phrase.matches[0].nodes.map((d: any) => toString(d)).join('')
      })
      return { keywords, keyPhrases }
    })
}

export const getImageFromKeywords = async (
  name: string,
  description: string,
  subject?: string
): Promise<(AssetInfo & { location: string }) | undefined> => {
  const getPhoto = async (keys: string[]): Promise<Random | undefined> => {
    let result = undefined
    let i = 0
    while (result === undefined && i < keys.length) {
      let key = keys[i]
      result = key
        ? await getRandomUnsplashImage(key).then((photo) => {
            return photo
          })
        : undefined
      i++
    }
    return result
  }

  const getKeywordPhotos = async (
    text: string
  ): Promise<Random | undefined> => {
    return getKeywords(text).then(async (k) => {
      const keywords = [k.keyPhrases, k.keywords]
      let result = undefined
      let i = 0
      while (i < keywords.length && result === undefined) {
        const keys = keywords[i]
        result =
          keys && keys.length > 0
            ? await getPhoto(keys).then((photo) => {
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

  const queries = [
    name,
    description,
    subject && [subject],
    subject && subject.split(''),
  ]

  let result = undefined
  let i = 0
  while (i < queries.length && result === undefined) {
    const key = queries[i]
    const getPhotoPromise = key
      ? typeof key === 'string'
        ? getKeywordPhotos(key)
        : getPhoto(key)
      : undefined

    result =
      getPhotoPromise &&
      (await getPhotoPromise.then((photo) => {
        if (photo) {
          return photo
        }
        return undefined
      }))
    i++
  }
  return result && parseUnsplashImage(result)
}
