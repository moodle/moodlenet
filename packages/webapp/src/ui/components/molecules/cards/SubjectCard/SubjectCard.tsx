import { Href, Link } from '../../../../elements/link'
import { withCtrl } from '../../../../lib/ctrl'
import '../../../../styles/tags.scss'
import { Organization } from '../../../../types'
import Card from '../../../atoms/Card/Card'
import './styles.scss'

export type SubjectCardProps = {
  title: string
  organization: Pick<Organization, 'url' | 'color'>
  subjectHomeHref: Href
}

export const SubjectCard = withCtrl<SubjectCardProps>(
  ({ title, organization, subjectHomeHref }) => {
    return (
      <Card
        style={{
          width: 'auto',
          maxWidth: '100%',
        }}
        hover={true}
        className="subject-card"
      >
        <div className="title">
          <Link href={subjectHomeHref}>
            <abbr title={title}>{title}</abbr>
          </Link>
        </div>
        <div className="subtitle">
          <div className="url">{organization.url}</div>
          <div
            className="color"
            style={{
              backgroundImage: `linear-gradient(to right, ${organization.color}, ${organization.color}65)`,
            }}
          ></div>
        </div>
      </Card>
    )
  }
)
export default SubjectCard
