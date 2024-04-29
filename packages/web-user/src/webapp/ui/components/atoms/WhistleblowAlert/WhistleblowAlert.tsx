import type { FloatingMenuContentItem } from '@moodlenet/component-library'
import { getAlertButtonElement } from '@moodlenet/component-library'
import { getTimeAgo } from '@moodlenet/component-library/common'
import { Link } from '@moodlenet/react-app/ui'
import { Flag } from '@mui/icons-material'
import type { WhistleblownResourceData } from '../../../../../common/types.mjs'
import './WhistleblowAlert.scss'

export type WhistleblowAlertProps = {
  whistleblow: WhistleblownResourceData
  // deleteNotification: () => void
}

export const WhistleblowAlert = ({
  whistleblow,
}: // deleteNotification,
WhistleblowAlertProps): FloatingMenuContentItem => {
  const { resource, type, date } = whistleblow

  const icon = (
    <Link href={resource.resourceHref} className="whistleblow-icon">
      <div className="flag-icon">
        <Flag />
      </div>
      <img src={whistleblow.resource.imageUrl} alt={'Resource image'} />
    </Link>
  )
  const content = (
    <Link className="whistleblow-header" href={resource.resourceHref}>
      <div className="whistleblow-title">
        <span className="resource-title">{resource.title}</span>
        was reported for
      </div>
      <div className="whistleblow-reason">{type.name}</div>
      <div className="whistleblow-date">{getTimeAgo(date)}</div>
    </Link>
  )

  return getAlertButtonElement({
    icon: icon,
    content: content,
    // deleteNotification: deleteNotification,
  })
}
