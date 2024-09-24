import type { AddonItem } from '@moodlenet/component-library'
import { Card } from '@moodlenet/component-library'
import type { Href } from '@moodlenet/react-app/common'
import { Link, withProxy } from '@moodlenet/react-app/ui'
import type { ReactElement } from 'react'
import './SubjectCard.scss'

export type SubjectCardOverallProps = {
  name: string
  value: number
  Icon: ReactElement
  key: string
}

export type SubjectCardProps = {
  mainColumnItems: (AddonItem | null)[]
  title: string
  subjectHomeHref: Href
  overallItems: SubjectCardOverallProps[]
}

export const SubjectCard = withProxy<SubjectCardProps>(
  ({ mainColumnItems, title, subjectHomeHref, overallItems }) => {
    const titleDiv = (
      <div className="title">
        <Link href={subjectHomeHref}>
          <abbr title={title}>{title}</abbr>
        </Link>
      </div>
    )

    const stats = overallItems.length > 0 && (
      <div className="stats">
        {overallItems.map(({ Icon, key, name, value }) => {
          return (
            <abbr className={key} title={name} key={key}>
              {Icon} {value}
            </abbr>
          )
        })}
      </div>
    )

    const updatedMainColumnItems = [titleDiv, stats, ...(mainColumnItems ?? [])].filter(
      (item): item is AddonItem | JSX.Element => !!item,
    )

    return (
      <Card
        style={{
          width: 'auto',
          maxWidth: '100%',
          // justifyContent: updatedMainColumnItems.length > 1 ? 'space-between' : 'flex-start',
        }}
        hover={true}
        className="subject-card"
      >
        {updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i))}
      </Card>
    )
  },
  'SubjectCard',
)

SubjectCard.displayName = 'SubjectCard'
