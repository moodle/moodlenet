import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useFormik } from 'formik'
import { ReportModal } from './ReportModal'

const meta: ComponentMeta<typeof ReportModal> = {
  title: 'Molecules/ReportModal',
  component: ReportModal,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: ['ReportModalStoryProps'],
  decorators: [
    (Story) => (
      <div style={{}}>
        <Story />
      </div>
    ),
  ],
}

const ReportModalStory: ComponentStory<typeof ReportModal> = (args) => (
  <ReportModal {...args} />
)

export const ReportModalStoryProps = () => {
  return {
    title: "Report Marcos's profile",
    reportForm: useFormik<{ comment: string }>({
      initialValues: { comment: '' },
      onSubmit: action('submit report Form'),
    }),
    setIsReporting: action('setIsReporting'),
    setShowReportedAlert: action('setShowReportedAlert'),
  }
}

export const Default = ReportModalStory.bind({})
Default.args = ReportModalStoryProps()

export default meta
