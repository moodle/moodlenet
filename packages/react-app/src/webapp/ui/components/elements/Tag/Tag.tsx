import { FollowTag } from '@moodlenet/component-library'
import { CSSProperties, FC } from 'react'
import { href } from '../../../../../common/lib.mjs'
import { Link } from '../link.js'
import './Tag.scss'

export type TagProps = {
  tag: FollowTag
  click: boolean
  index: number
  size?: 'small' | 'medium' | 'big'
  style?: CSSProperties
}

export const Tag: FC<TagProps> = ({ tag, size, index = 0, click = true, style }) => {
  return click && tag.href ? (
    <Link href={tag.href} className="tag-container" key={index}>
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

export const getTagList = (tags: FollowTag[], size: 'small' | 'medium' | 'big', click = true) => {
  return tags.map((tag, i) => {
    // return getTag(tag, size, click, index)
    return <Tag key={tag.name} tag={tag} size={size} click={click} index={i} />
  })
}

export const TagListStory: FollowTag[] = [
  {
    type: 'subject',
    name: 'Agroforestry',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Biology',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'collection',
    name: 'Desertification',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'collection',
    name: 'Rainforest',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'collection',
    name: 'Monitoring',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Reforestation',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'collection',
    name: 'Brazilian Politics',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'collection',
    name: 'Reserves',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'collection',
    name: 'Indigenous People',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Climate Change',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Ecology',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'collection',
    name: 'Silviculture',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Botanic',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Mathematics',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Politology',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Ethology',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Ideology',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Religions',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Meditation',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Data Bases',
    href: href('Pages/subject/Logged In'),
  },
  {
    type: 'subject',
    name: 'Machine Learning',
    href: href('Pages/subject/Logged In'),
  },
]
