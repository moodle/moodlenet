import type { MutableRefObject } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getBackupImage, getWindowDimensions } from './misc'
import type { CreditedImage } from './types'

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
export const useImageCredits = (
  image: CreditedImage | undefined | null,
  id = `${Math.random() * 100}`,
) => {
  const backupImage: CreditedImage | null | undefined = useMemo(() => getBackupImage(id), [id])
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

type RefT<T> = ((instance: T | null) => void) | MutableRefObject<T | null> | null
export function useForwardedRef<T>(ref: RefT<T>) {
  const innerRef = useRef<T>(null)
  useEffect(() => {
    if (!ref) return
    if (typeof ref === 'function') {
      ref(innerRef.current)
    } else {
      ref.current = innerRef.current
    }
  })

  return innerRef
}

export const useImageUrl = (
  maybe_url_or_file: undefined | null | Blob | string,
  defaultUrl?: string | Blob | undefined,
) => {
  const [url, setUrl] = useState<string>()
  const isFile = maybe_url_or_file instanceof Blob

  useEffect(() => {
    const newUrl = getImageUrl(maybe_url_or_file ?? undefined, getImageUrl(defaultUrl, undefined))
    setUrl(newUrl)
    return isFile && newUrl ? () => URL.revokeObjectURL(newUrl) : undefined
  }, [maybe_url_or_file, defaultUrl, isFile])

  return [url, isFile] as const

  function getImageUrl(
    maybe_url_or_file: undefined | Blob | string,
    defaultUrl: string | undefined,
  ) {
    return !maybe_url_or_file
      ? defaultUrl
      : typeof maybe_url_or_file === 'string'
        ? maybe_url_or_file
        : URL.createObjectURL(maybe_url_or_file)
  }
}
