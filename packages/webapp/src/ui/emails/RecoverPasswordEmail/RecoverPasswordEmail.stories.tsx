import { ComponentMeta, ComponentStory } from '@storybook/react'
import { FC } from 'react'
import { RecoverPasswordEmail } from './RecoverPasswordEmail'

export const Email: FC<{}> = () => {
  return RecoverPasswordEmail
}



const meta: ComponentMeta<typeof Email> = {
  title: 'Emails/Access/RecoverPasswordEmail',
  excludeStories: ['Email'],
  parameters: { layout: 'fullscreen' },
}

const RecoverPasswordEmailStory: ComponentStory<typeof Email> = () => <Email />
  

export const Default = RecoverPasswordEmailStory.bind({})

export default meta
