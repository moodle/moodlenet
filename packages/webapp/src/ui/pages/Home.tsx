import { FC } from 'react'
import { EmptyPageTemplate } from '../templates/page/EmptyPageTemplate'

export type HomePageProps = {}
export const HomePage: FC<HomePageProps> = () => {
  return <EmptyPageTemplate>Home</EmptyPageTemplate>
}
