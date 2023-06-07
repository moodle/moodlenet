import { href } from '@moodlenet/react-app/common'
import type { PartialDeep } from 'type-fest'
import type { SubjectCardProps } from '../components/organisms/SubjectCard/SubjectCard.js'

export const subjectsCardFactory: PartialDeep<SubjectCardProps>[] = [
  {
    mainColumnItems: [],

    subjectHomeHref: href('Pages/Subject/Logged In'),
    title: 'Building and civil engineering',
  },
  {
    mainColumnItems: [],
    subjectHomeHref: href('Pages/Subject/Logged In'),
    title: 'Mathematics',
  },
  {
    mainColumnItems: [],
    subjectHomeHref: href('Pages/Subject/Logged In'),
    title: 'Biology',
  },
  {
    mainColumnItems: [],
    subjectHomeHref: href('Pages/Subject/Logged In'),
    title: 'Chemistry',
  },
  {
    mainColumnItems: [],
    subjectHomeHref: href('Pages/Subject/Logged In'),
    title: 'Computer Science',
  },
  {
    mainColumnItems: [],
    subjectHomeHref: href('Pages/Subject/Logged In'),
    title: 'Archeology',
  },
]
