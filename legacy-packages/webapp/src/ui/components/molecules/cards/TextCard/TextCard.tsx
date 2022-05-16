import { FC } from 'react'
import Card from '../../../atoms/Card/Card'
import './styles.scss'

export type TextCardProps = {
  className?: string
}

export const TextCard: FC<TextCardProps> = ({ className, children }) => {
  return (
    <Card className={`text-card${' ' + className}`} hideBorderWhenSmall={true}>
      {children}
    </Card>
  )
}

export default TextCard
