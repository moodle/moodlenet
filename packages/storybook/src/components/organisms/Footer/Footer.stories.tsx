import type { ComponentMeta, ComponentStory } from '@storybook/react'
// import { href } from '../../../../elements/link'
import type { MainFooterProps } from '@moodlenet/react-app/ui'
import { MainFooter } from '@moodlenet/react-app/ui'
import PoweredByMoodleNet from '../../../assets/logos/powered-by-moodlenet.svg'

const meta: ComponentMeta<typeof MainFooter> = {
  title: 'Organisms/Footer',
  component: MainFooter,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['FooterStoryProps'],
  decorators: [
    Story => (
      <div style={{ alignItems: 'flex-start', width: '100%', height: '100%' }}>
        <Story />
      </div>
    ),
  ],
}

export const FooterStoryProps: MainFooterProps = {
  leftItems: [],
  centerItems: [
    {
      Item: () => <img className="logo big" src={PoweredByMoodleNet} alt="Logo" />,
      key: 'powered-by-moodlenet',
    },
  ],
  rightItems: [],
}

const FooterStory: ComponentStory<typeof MainFooter> = args => <MainFooter {...args} />

export const Default = FooterStory.bind({})
Default.args = FooterStoryProps

export default meta
