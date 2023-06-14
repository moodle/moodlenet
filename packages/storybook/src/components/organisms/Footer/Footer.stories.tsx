import type { ComponentMeta, ComponentStory } from '@storybook/react'
// import { href } from '../../../../elements/link'
import type { MainFooterProps } from '@moodlenet/react-app/ui'
import { MainFooter } from '@moodlenet/react-app/ui'
import { Favorite } from '@mui/icons-material'

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
      Item: () => (
        <div
          className="extended"
          style={{ textAlign: 'center', color: '#6b6b6b', fontSize: '14px' }}
        >
          We'd love to get{' '}
          <a
            href="https://feedback.moodle.org/index.php?r=survey/index&sid=766627&lang=en"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#0a60ff' }}
          >
            your feedback on MoodleNet
          </a>
          <Favorite
            titleAccess="love"
            className="love-icon"
            style={{
              paddingBottom: '6px',
              margin: '0 0 -9px 0',
              color: '#fc0071',
            }}
          />{' '}
          You can suggest new features and report bugs in the{' '}
          <a href="https://moodle.org/mod/forum/view.php?id=8726" target="_blank" rel="noreferrer">
            MoodleNet community
          </a>
          .
        </div>
      ),
      key: 'feedback-and-community-footer',
    },
  ],
  rightItems: [],
  showCopyright: false,
  // text-align: center;
  // color: #6b6b6b;
  // font-size: 14px;
  // > a {
  //   color: #0a60ff;
  //   &:hover {
  //     text-decoration: underline;
  //   }
  // }
  // > .love-icon {
  //   padding-bottom: 6px;
  //   margin: 0 0 -9px 0;
  //   color: #fc0071;
  // }
}

const FooterStory: ComponentStory<typeof MainFooter> = args => <MainFooter {...args} />

export const Default = FooterStory.bind({})
Default.args = FooterStoryProps

export default meta
