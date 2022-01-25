import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { FC } from 'react'
import { tagList } from '../../../elements/tags'
import '../../../styles/tags.css'
import { FollowTag } from '../../../types'
import './styles.scss'

export type SubHeaderProps = {
  tags: FollowTag[]
}
export const SubHeader: FC<SubHeaderProps> = ({ tags }) => {
  return (
    <div className="subheader">
      <div className="title">
        <ExpandMoreIcon />
        <div className="text">Following</div>
      </div>
      <div className="tags scroll">
        {tagList(tags, 'small', true)}
        <div className="empty-space">&nbsp;</div>
      </div>
    </div>
  )
}

export default SubHeader
