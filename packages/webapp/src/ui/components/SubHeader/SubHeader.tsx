import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { FC } from 'react'
import '../../styles/tags.css'
import { FollowTag } from '../../types'
import './styles.scss'

export type SubHeaderProps = {
  tags: FollowTag[]
}
export const SubHeader: FC<SubHeaderProps> = ({ tags }) => {
  const tagList = tags.map((value, index) => {
    return (
      <div key={index} className={'tag tag' + value.type}>
        {value.name}
      </div>
    )
  })

  return (
    <div className="subheader">
      <div className="title">
        <ExpandMoreIcon />
        <div className="text">Following</div>
      </div>
      <div className="tags scroll">
        {tagList}
        <div className="empty-space">&nbsp;</div>
      </div>
    </div>
  )
}

export default SubHeader
