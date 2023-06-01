import type { AddonItem, Organization } from '@moodlenet/component-library'
import { Card } from '@moodlenet/component-library'
import type { Href } from '@moodlenet/react-app/common'
import { Link, withProxy } from '@moodlenet/react-app/ui'
import './SubjectCard.scss'

export type SubjectCardProps = {
  mainColumnItems: (AddonItem | null)[]
  title: string
  subjectHomeHref: Href
  organization: Pick<Organization, 'url' | 'color'> | null
}

export const SubjectCard = withProxy<SubjectCardProps>(
  ({ mainColumnItems, title, subjectHomeHref, organization }) => {
    const titleDiv = (
      <div className="title">
        <Link href={subjectHomeHref}>
          <abbr title={title}>{title}</abbr>
        </Link>
      </div>
    )

    const organizationDiv = organization ? (
      <div className="subtitle">
        <div className="url">{organization.url}</div>
        <div
          className="color"
          style={{
            backgroundImage: `linear-gradient(to right, ${organization.color}, ${organization.color}65)`,
          }}
        ></div>
      </div>
    ) : null

    const updatedMainColumnItems = [titleDiv, organizationDiv, ...(mainColumnItems ?? [])].filter(
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
