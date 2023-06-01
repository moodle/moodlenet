import { getRandomSortedArrayElements } from '@moodlenet/component-library'
import type { SubjectCardProps } from '@moodlenet/ed-meta/ui'
import { subjectsCardFactory } from '@moodlenet/ed-meta/ui'
import { transformPropsToObjectWithKey } from '@moodlenet/react-app/ui'
import type { PartialDeep } from 'type-fest'
import { getSubjectCardStoryProps } from './SubjectCard.stories.js'

export const getSubjectCardsStoryProps = (
  amount = 8,
  overrides?: PartialDeep<SubjectCardProps>,
): { props: SubjectCardProps; key: string }[] => {
  return getRandomSortedArrayElements(subjectsCardFactory, amount).map((subject, i) => {
    const newSubject = getSubjectCardStoryProps({
      ...subject,
      ...overrides,
    })
    return transformPropsToObjectWithKey(newSubject, i)
  })
}
