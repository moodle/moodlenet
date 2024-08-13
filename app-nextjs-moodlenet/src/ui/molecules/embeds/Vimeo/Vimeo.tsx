'use client'
import type { EmbedType, ThumbnailType } from '@/lib/ui/utilities'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import './Vimeo.scss'

export const getVimeoId = (url: string): string | null => {
  const regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/
  const match = url.match(regExp)
  return match && match[5] ? match[5] : null
}

export const getVimeoEmbed = (url: string): EmbedType => {
  const id = getVimeoId(url)
  return id ? <VimeoEmbed id={id} /> : null
}

export const getVimeoThumbnail = (url: string): ThumbnailType => {
  const id = getVimeoId(url)
  return id ? `https://vumbnail.com/${id}.jpg` : null
}

type VimeoType = {
  height: number
  width: number
}

export const VimeoEmbed: FC<{ id: string }> = ({ id }) => {
  const [data, setData] = useState<VimeoType>()

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(`https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/${id}`)
      ).json()

      setData(data)
    }

    dataFetch()
  }, [id])

  return (
    <iframe
      className="vimeo-embed"
      referrerPolicy="strict-origin"
      src={`https://player.vimeo.com/video/${id}`}
      style={{ aspectRatio: `${data?.width ?? 16}/${data?.height ?? 9}` }}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    ></iframe>
  )
}
