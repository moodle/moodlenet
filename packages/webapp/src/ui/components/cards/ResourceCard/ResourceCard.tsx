import { withProps } from '../../../lib/__/ctrl'
import '../../../styles/tags.css'
import './styles.scss'

export type ResourceCardProps = {
  tags: Array<string>
  image: string
  type: 'Video' | 'Web Page' | 'Moodle Book'
  title: string
}

export const ResourceCard = withProps<ResourceCardProps>(({ tags, image, type, title }) => {
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
    <div className="resource-card">
      <img className="image" src={image} alt="Background" />
      <div className="info">
        <div className="type" style={{ color: color }}>
          {type}
        </div>
        <div className="title">
          <abbr title={title}>{title}</abbr>
        </div>
        <div className="tags">{tagSet}</div>
      </div>
    </div>
  )
})
