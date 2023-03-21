import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SubjectsTextOptionProps } from '../../../../common/data.js'
import { subjectValidationSchema } from '../../../../common/validationSchema.js'
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
  const subject = '0000'
  return {
    subject: subject,
    subjects: {
      opts: SubjectsTextOptionProps,
      selected: SubjectsTextOptionProps.find(({ value }) => value === subject),
    },
    canEdit: true,
    isEditing: true,
    isSubmitting: false,
    shouldShowErrors: false,
    editSubject: action('editSubject'),
    validationSchema: subjectValidationSchema,
    setCategoryFilter: action('setCategoryFilter'),
    ...overrides,
  }
}

export const Default: SubjectFieldStory = () => {
  const props = useSubjectFieldStoryProps({})
  return <SubjectField {...props} />
}

// export const Props: SubjectFieldProps = {
//   subject: 'subject',
//   subjects: {
//     opts: SubjectsTextOptionProps,
//     selected: SubjectsTextOptionProps.find(({ value }) => value === 'subject'),
//   },
//   canEdit: true,
//   isEditing: true,
//   isSubmitting: false,
//   shouldShowErrors: false,
//   editSubject: () => Promise.resolve(),
//   validationSchema: subjectValidationSchema,
//   setCategoryFilter: action('setCategoryFilter'),
// }

// export const Owner = SubjectFieldStory.bind({})
// Owner.args = Props

export default meta
