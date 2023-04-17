import { FC, useEffect, useState } from 'react'
import { EmbedType, ThumbnailType } from '../../../../helpers/utilities.js'
import './YouTube.scss'

export const getYouTubeId = (url: string) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[7] && match[7].length == 11 ? match[7] : false
}

export const getYouTubeEmbed = (url: string): EmbedType => {
  const id = getYouTubeId(url)
  return id ? <YouTubeEmbed id={id} /> : null
}

export const getYouTubeThumbnail = (url: string): ThumbnailType => {
  const id = getYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/0.jpg` : null
}

type YouTubeType = {
  height: number
  width: number
}

export const YouTubeEmbed: FC<{ id: string }> = ({ id }) => {
  const [data, setData] = useState<YouTubeType>()

  useEffect(() => {
    // fetch data
    const dataFetch = async () => {
      const data = await (
        await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
        )
      ).json()

      setData(data)
    }

    dataFetch()
  }, [id])

  return (
    <iframe
      className="youtube-embed"
      src={`https://www.youtube.com/embed/${id}`}
      style={{ aspectRatio: `${data?.width ?? 16}/${data?.height ?? 9}` }}
      title="YouTube video player"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
      allowFullScreen
    />
  )
}
