import { FC } from 'react'
import { Card, Image, Label } from 'semantic-ui-react'
import { Link } from '../../elements/link'

export type ResourceCardProps = {
  icon: string | null
  name: string
  type: string
  homeLink: string
  collections: { name: string; homeLink: string }[]
}
export const ResourceCard: FC<ResourceCardProps> = props => {
  const { icon, name, type, homeLink, collections, children } = props
  return (
    <Card fluid>
      <Card.Content>
        <Image floated="left" size="tiny" src={icon} />
        <Card.Header>
          <Link href={homeLink}>{name}</Link>
        </Card.Header>
        <Card.Meta>{type}</Card.Meta>
      </Card.Content>
      <Card.Content extra>
        {collections.map(({ homeLink, name }) => (
          <Link href={homeLink} key={homeLink}>
            <Label color="red" horizontal circular size="mini">
              {name}
            </Label>
          </Link>
        ))}
        {children}
      </Card.Content>
    </Card>
  )
}
