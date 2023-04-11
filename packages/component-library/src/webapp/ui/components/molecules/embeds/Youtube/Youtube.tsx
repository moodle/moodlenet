import { FC, ReactElement, useEffect, useState } from 'react'
import './Youtube.scss'

export const getYoutubeId = (url: string) => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[7] && match[7].length == 11 ? match[7] : false
}

export const getYoutubeEmbed = (url: string): ReactElement | null => {
  const id = getYoutubeId(url)
  return id ? <YoutubeEmbed id={id} /> : null
}

export const getYoutubeThumbnail = (url: string): string | null => {
  const id = getYoutubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/0.jpg` : null
}

type YoutubeType = {
  height: number
  width: number
  thumbnail_height: number
  thumbnail_width: number
}

export const YoutubeEmbed: FC<{ id: string }> = ({ id }) => {
  const [data, setData] = useState<YoutubeType>()

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
      style={{ aspectRatio: `${data?.width ?? 16}/${data?.height ?? 9}`, borderRadius: '10px' }}
      title="YouTube video player"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
      allowFullScreen
    />
  )
}
