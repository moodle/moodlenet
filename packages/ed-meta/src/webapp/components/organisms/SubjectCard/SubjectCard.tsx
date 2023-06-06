import type { AddonItem } from '@moodlenet/component-library'
import { Card } from '@moodlenet/component-library'
import type { Href } from '@moodlenet/react-app/common'
import { Link, withProxy } from '@moodlenet/react-app/ui'
import { FilterNone, PermIdentity } from '@mui/icons-material'
import './SubjectCard.scss'

export type SubjectCardProps = {
  mainColumnItems: (AddonItem | null)[]
  title: string
  subjectHomeHref: Href
  numFollowers: number
  numResources: number
}

export const SubjectCard = withProxy<SubjectCardProps>(
  ({ mainColumnItems, title, subjectHomeHref, numFollowers, numResources }) => {
    const titleDiv = (
      <div className="title">
        <Link href={subjectHomeHref}>
          <abbr title={title}>{title}</abbr>
        </Link>
      </div>
    )

    const stats = (
      <div className="stats">
        <abbr className="followers" title="Followers">
          <PermIdentity /> {numFollowers}
        </abbr>
        <abbr className="resources" title="Resources">
          <FilterNone /> {numResources}
        </abbr>
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
