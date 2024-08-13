import { ContentBackupImages } from 'assets/data/images'
import type { AssetInfo } from '@/common/types'
import { getDomainUrl } from '@/common/utilities'
import assert from 'assert'
import type { ReactElement } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { getVimeoEmbed, getVimeoThumbnail } from '@/ui/molecules/embeds/Vimeo/Vimeo.jsx'
import { getYouTubeEmbed, getYouTubeThumbnail } from '@/ui/molecules/embeds/Youtube/Youtube.jsx'
import { AddonItem } from '../types.jsx'

export const elementFullyInViewPort = (
  el: Element,
  options?: {
    marginTop?: number
  },
): boolean => {
  const boundingClient = el.getBoundingClientRect()
  const { left, right, bottom } = boundingClient
  let { top } = boundingClient

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

export const isEllipsisActive = (e: HTMLElement) =>
  e.offsetWidth < e.scrollWidth || e.offsetHeight < e.scrollHeight

export const range = (size: number, startAt = 0) => {
  return [...Array(size).keys()].map(i => i + startAt)
}

export const shuffleArray = <T,>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const [element_i, element_j] = [array[i], array[j]]
    assert(element_i && element_j, 'This should never happen')
    ;[array[i], array[j]] = [element_j, element_i]
  }
  return array
}

export const getRandomInt = (max: number): number => Math.floor(Math.random() * max)

export const randomIntFromInterval = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const fileExceedsMaxUploadSize = (size: number, max: number | null) =>
  max === null ? false : size > max

export const getYearList = (startYear: number): string[] => {
  const currentYear = new Date().getFullYear()
  const years = []
  while (startYear <= currentYear) {
    years.push((startYear++).toString())
  }
  return years.reverse()
}

export const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
}

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}

export const getNumberFromString = (s: string) => {
  let number = 1

  s.split('').forEach(l => {
    number = number * l.charCodeAt(0)
  })

  return number
}

export const getPastelColor = (i?: number, opacity = 1) => {
  const number = i ? parseFloat('0.' + i.toString().slice(0, 5).replace('.', '')) : Math.random()
  return 'hsla(' + 360 * number + ',' + '75%,' + '50%, ' + opacity + ')'
  // return 'hsla(' + 360 * number + ',' + (25 + 60 * number) + '%,' + (45 + 1 * number) + '%, ' + opacity + ')'
}

export const getBackupImage = (id: string): AssetInfo | undefined => {
  const numId = getNumberFromString(id)
  return ContentBackupImages[numId % ContentBackupImages.length]
}

export const useImageCredits = (
  image: AssetInfo | undefined | null,
  id = `${Math.random() * 100}`,
) => {
  const backupImage: AssetInfo | null | undefined = useMemo(() => getBackupImage(id), [id])
  const credits = image ? (image.credits ? image.credits : undefined) : backupImage?.credits
  return (
    credits && (
      <div className="image-credits" key="image-credits">
        Photo by
        <a href={credits.owner.url} target="_blank" rel="noreferrer">
          {credits.owner.name}
        </a>
        on
        {
          <a href={credits.owner.url} target="_blank" rel="noreferrer">
            {credits.provider?.name}
          </a>
        }
      </div>
    )
  )
}

export type EmbedType = ReactElement | null
export type ThumbnailType = string | null

export const getPreviewFromUrl = (url: string): EmbedType => {
  const domain = getDomainUrl(url)
  switch (domain) {
    case 'youtube.com':
    case 'youtu.be':
      return getYouTubeEmbed(url)
    case 'vimeo.com':
      return getVimeoEmbed(url)
    default:
      return null
  }
}

export const getThumbnailFromUrl = (url: string): ThumbnailType => {
  const domain = getDomainUrl(url)
  switch (domain) {
    case 'youtube.com':
    case 'youtu.be':
      return getYouTubeThumbnail(url)
    case 'vimeo.com':
      return getVimeoThumbnail(url)
    default:
      return null
  }
}

export const sortAddonItems = (
  items: (AddonItem | JSX.Element | null | boolean)[],
): (AddonItem | JSX.Element)[] => {
  return items
    .sort((a, b) => {
      const aPosition =
        a && typeof a !== 'boolean' && 'position' in a && a.position !== undefined
          ? a.position
          : undefined
      const bPosition =
        b && typeof b !== 'boolean' && 'position' in b && b.position !== undefined
          ? b.position
          : undefined

      // Check if both objects have the 'position' property
      if (typeof aPosition === 'number' && typeof bPosition === 'number') {
        // Compare by 'position' if both have it
        return aPosition - bPosition
      }

      // If one of them doesn't have 'position', place it after the one with 'position'
      if (aPosition === undefined) {
        return 1 // Move 'a' to a higher index (after 'b')
      } else {
        return -1 // Move 'b' to a higher index (after 'a')
      }
    })

    .filter((item): item is AddonItem | JSX.Element => !!item)
}
