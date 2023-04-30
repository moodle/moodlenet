import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SubjectField, SubjectFieldProps } from './SubjectField.js'

const meta: ComponentMeta<typeof SubjectField> = {
  title: 'Atoms/SubjectField',
  component: SubjectField,
  excludeStories: ['useSubjectFieldStoryProps'],
}

type SubjectFieldStory = ComponentStory<typeof SubjectField>

export const useSubjectFieldStoryProps = (
  overrides?: Partial<SubjectFieldProps>,
): SubjectFieldProps => {
  return {
    subject: '',
    canEdit: true,
    shouldShowErrors: false,
    editSubject: action('editSubject'),
    ...overrides,
  }
}

export const Default: SubjectFieldStory = () => {
  const props = useSubjectFieldStoryProps({})
  return <SubjectField {...props} />
}

export default meta
