import { createApi } from 'unsplash-js'
import { Basic, Random } from 'unsplash-js/dist/methods/photos/types'
import { ContentBackupImages, RecursivePartial } from '../ui/assets/data/images'

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

export const getBackupImage = (
  id: string
): RecursivePartial<Basic> | undefined => {
  const numId = getNumberFromString(id)
  return ContentBackupImages[numId % ContentBackupImages.length]
}

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max)
}

export const getNewRandomImage = (
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
