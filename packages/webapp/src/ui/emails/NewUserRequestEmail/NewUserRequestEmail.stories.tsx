import { ComponentMeta, ComponentStory } from '@storybook/react'
import { FC } from 'react'
import { NewUserRequestEmail } from './NewUserRequestEmail'

export const Email: FC<{}> = () => {
  return NewUserRequestEmail
}



const meta: ComponentMeta<typeof Email> = {
  title: 'Emails/Access/NewUserRequestEmail',
  excludeStories: ['Email'],
  parameters: { layout: 'fullscreen' },
}

const NewUserRequestEmailStory: ComponentStory<typeof Email> = () => <Email />
  

export const Default = NewUserRequestEmailStory.bind({})

export default meta
