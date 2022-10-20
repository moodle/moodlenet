import { CSSProperties } from 'react'
import { FollowTag } from '../types'
import { href, Link } from './link'

export const getTag = (
  tag: FollowTag,
  size?: 'small' | 'medium' | 'big',
  click = true,
  index = 0,
  style?: CSSProperties
) => {
  return click && tag.subjectHomeHref ? (
    <Link href={tag.subjectHomeHref} className="tag-container" key={index}>
      <div className={`tag ${tag.type} hover ${size}`} style={style}>
        <abbr title={tag.name}>{tag.name}</abbr>
      </div>
    </Link>
  ) : (
    <div className={`tag ${tag.type} ${size}`} key={index} style={style}>
      <abbr title={tag.name}>{tag.name}</abbr>
    </div>
  )
}

export const getTagList = (
  tags: FollowTag[],
  size: 'small' | 'medium' | 'big',
  click = true
) => {
  return tags.map((tag, index) => {
    return getTag(tag, size, click, index)
  })
}

export const TagListStory: FollowTag[] = [
  {
    type: 'subject',
    name: 'Agroforestry',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Biology',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'collection',
    name: 'Desertification',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'collection',
    name: 'Rainforest',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'collection',
    name: 'Monitoring',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Reforestation',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'collection',
    name: 'Brazilian Politics',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'collection',
    name: 'Reserves',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'collection',
    name: 'Indigenous People',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Climate Change',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Ecology',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'collection',
    name: 'Silviculture',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Botanic',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Mathematics',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Politology',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Ethology',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Ideology',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Religions',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Meditation',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Data Bases',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Machine Learning',
    subjectHomeHref: href('Pages/subject/Logged In'),
  },
]
