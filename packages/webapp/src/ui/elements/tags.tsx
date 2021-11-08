import { FollowTag } from '../types'
import { href, Link } from './link'

export const tagList = (tags: FollowTag[], click: boolean) => {
  return tags.map((tag, index) => {
    return click ? (
      <Link href={tag.subjectHomeHref} key={index}>
        <div className={`tag tag${tag.type} hover`}>{tag.name}</div>
      </Link>
    ) : (
      <div className={`tag tag${tag.type}`} key={index}>
        {tag.name}
      </div>
    )
  })
}

export const TagListStory: FollowTag[] = [
  {
    type: 'General',
    name: '#Agroforestry',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Biology',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'Specific',
    name: 'Desertification',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'Specific',
    name: 'Rainforest',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'Specific',
    name: 'Monitoring',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Reforestation',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'Specific',
    name: 'Brazilian Politics',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'Specific',
    name: 'Reserves',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'Specific',
    name: 'Indigenous People',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Climate Change',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Ecology',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'Specific',
    name: 'Silviculture',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
  {
    type: 'General',
    name: '#Botanic',
    subjectHomeHref: href('Pages/Category/Logged In'),
  },
]
