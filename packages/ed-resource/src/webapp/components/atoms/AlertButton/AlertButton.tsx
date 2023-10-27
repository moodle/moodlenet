import type { Href } from '@moodlenet/component-library'
import { Link } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import { ReactComponent as AlertIcon } from '../../../assets/icons/notification-bell.svg'
import './AlertButton.scss'

export type AlertButtonProps = {
  profileHref: Href
  numResourcesToReview: number
} & React.HTMLAttributes<HTMLDivElement>

export const AlertButton: FC<AlertButtonProps> = ({
  profileHref,
  numResourcesToReview,
  ...props
}) => {
  return (
    <abbr
      className={`alert-button`}
      title={`${numResourcesToReview} resource${
        numResourcesToReview > 1 ? 's' : ''
      } ready to review`}
      {...props}
    >
      <Link href={profileHref}>
        <div className="red-dot" />
        <div className="alert-icon-container">
          <AlertIcon />
        </div>
      </Link>
    </abbr>
  )
}

AlertButton.defaultProps = {}

export default AlertButton
