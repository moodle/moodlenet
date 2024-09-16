import { useEffect, useState } from 'react'

const getImageUrl = (
  maybe_url_or_file: undefined | Blob | string | null,
  defaultUrl: string | undefined,
) =>
  !maybe_url_or_file
    ? defaultUrl
    : typeof maybe_url_or_file === 'string'
      ? maybe_url_or_file
      : URL.createObjectURL(maybe_url_or_file)

export const useImageUrl = (
  maybe_url_or_file: undefined | null | Blob | string,
  defaultUrl?: string | Blob | undefined | null,
) => {
  const [url, setUrl] = useState<string>()
  const isFile = maybe_url_or_file instanceof Blob

  useEffect(() => {
    const newUrl = getImageUrl(maybe_url_or_file ?? undefined, getImageUrl(defaultUrl, undefined))
    setUrl(newUrl)
    return isFile && newUrl ? () => URL.revokeObjectURL(newUrl) : undefined
  }, [maybe_url_or_file, defaultUrl, isFile])

  return [url, isFile] as const
}
