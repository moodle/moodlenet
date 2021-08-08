import { Trans } from '@lingui/macro'
import Card from '../../../components/atoms/Card/Card'
import { withCtrl } from '../../../lib/ctrl'
import '../../../styles/tags.css'
import './styles.scss'

export type InfoCardProps = {
  tags: Array<string>
  type: 'Video' | 'Web Page' | 'Moodle Book'
  title: string
}

export const InfoCard = withCtrl<InfoCardProps>(({ tags, type, title }) => {
  const tagSet = tags.map((value: string, index: number) => {
    return (
      <div key={index} className="tag">
        {value}
      </div>
    )
  })

  let color = ''
  switch (type) {
    case 'Video':
      color = '#2c7bcb'
      break
    case 'Web Page':
      color = '#cc4fd1'
      break
    default:
      color = '#20c184'
  }

  return (
    <Card className="info-card">
      <div className="type">
        <span></span><Trans>Resource</Trans>
        <div style={{ color: color }}>&nbsp;/ {type}</div>
      </div>
      <div className="title">{title}</div>   
      <div className="tags scroll">{tagSet}</div>
    </Card>
  )
})
