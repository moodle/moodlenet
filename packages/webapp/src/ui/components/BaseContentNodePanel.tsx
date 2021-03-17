import { FC } from 'react'
import { Card, Image } from 'semantic-ui-react'
import { Link } from '../elements/link'
import { UseProps } from '../types'

export type BaseContentNodePanelProps = {
  useProps: UseBaseContentNodePanelProps
}
export type UseBaseContentNodePanelProps = UseProps<{
  icon: string | null
  name: string
  summary: string
  type: string
  link: string
} | null>
export const BaseContentNodePanel: FC<BaseContentNodePanelProps> = ({ useProps }) => {
  const props = useProps()
  if (!props) {
    return null
  }
  const { icon, link, name, summary, type } = props
  return (
    <Card>
      <Link href={link}>
        <Image src={icon} wrapped ui={false} />
        <Card.Content>
          <Card.Header>{name}</Card.Header>
          <Card.Meta>{type}</Card.Meta>
          <Card.Description>{summary}</Card.Description>
        </Card.Content>
      </Link>
    </Card>
  )
}
