import type { LearningOutcome, LearningOutcomeOption } from '@moodlenet/ed-meta/common'
import { href } from '@moodlenet/react-app/common'
import {
  WhistleblowResourceOptionType,
  WhistleblowResourceReasonName,
  WhistleblownResourceData,
} from '@moodlenet/web-user/common'

export const learningOutcomesSelection: LearningOutcome[] = [
  // {
  //   category: '1',
  //   verb: 'Define',
  //   sentence: 'the concept of ecological balance within ecosystems.',
  // },
  {
    code: '2',
    verb: 'Explain',
    sentence: 'the consequences of habitat fragmentation on biodiversity.',
  },
  {
    code: '3',
    verb: 'Apply',
    sentence: 'conservation principles to protect specific habitats.',
  },
  // {
  //   category: '4',
  //   verb: 'Analyze',
  //   sentence: ' species data to identify ecosystem decline patterns.',
  // },
  {
    code: '5',
    verb: 'Develop',
    sentence: 'a comprehensive plan for ecosystem restoration.',
  },
  // {
  //   category: 'Evaluation',
  //   verb: 'Assess',
  //   sentence: ' the impact and success of conservation projects on biodiversity.',
  // },
]

export const learningOutcomeOptions: LearningOutcomeOption[] = [
  {
    code: '1',
    name: 'Knowledge',
    verbs: [
      'Define',
      'Describe',
      'Identify',
      'Label',
      'List',
      'Match',
      'Memorize',
      'Name',
      'Outline',
      'Recall',
      'Recognize',
      'Relate',
      'Reproduce',
      'Select',
      'State',
    ],
  },
  {
    code: '2',
    name: 'Comprehension',
    verbs: [
      'Classify',
      'Convert',
      'Defend',
      'Discuss',
      'Distinguish',
      'Estimate',
      'Explain',
      'Express',
      'Extend',
      'Generalize',
      'Give examples',
      'Identify',
      'Indicate',
      'Infer',
      'Interpret',
      'Paraphrase',
      'Predict',
      'Rewrite',
      'Report',
      'Restate',
      'Review',
      'Rewrite',
      'Summarize',
      'Translate',
      'Understand',
    ],
  },
  {
    code: '3',
    name: 'Application',
    verbs: [
      'Apply',
      'Change',
      'Choose',
      'Compute',
      'Construct',
      'Develop',
      'Discover',
      'Dramatize',
      'Employ',
      'Illustrate',

      'Interpret',
      'Manipulate',
      'Modify',
      'Operate',
      'Practice',
      'Predict',
      'Prepare',
      'Produce',
      'Relate',
      'Schedule',
      'Show',
      'Sketch',
      'Solve',
      'Use',
      'Write',
    ],
  },

  {
    code: '4',
    name: 'Analysis',
    verbs: [
      'Analyze',
      'Appraise',
      'Break down',
      'Calculate',
      'Categorize',
      'Compare',
      'Contrast',
      'Criticize',
      'Debate',
      'Diagram',
      'Differentiate',
      'Discriminate',
      'Distinguish',
      'Examine',
      'Experiment',
      'Identify',
      'Illustrate',
      'Infer',
      'Inquire',
      'Inspect',
      'Investigate',
      'Outline',
      'Point out',
      'Question',
      'Relate',
      'Research',

      'Select',
      'Separate',
      'Subdivide',
      'Test',
    ],
  },
  {
    code: '5',
    name: 'Synthesis',
    verbs: [
      'Arrange',
      'Assemble',
      'Collect',
      'Compose',
      'Construct',
      'Create',
      'Design',
      'Develop',
      'Devise',
      'Explain',

      'Formulate',
      'Generate',
      'Integrate',
      'Invent',
      'Manage',

      'Organize',
      'Plan',
      'Prepare',
      'Propose',
      'Rearrange',
      'Reconstruct',
      'Relate',
      'Reorganize',
      'Revise',
      'Rewrite',
      'Set up',
      'Summarize',
      'Tell',
      'Write',
    ],
  },
  {
    code: '6',
    name: 'Evaluation',
    verbs: [
      'Appraise',
      'Argue',
      'Assess',
      'Choose',

      'Compare',
      'Conclude',
      'Contrast',
      'Criticize',
      'Critique',
      'Debate',
      'Decide',
      'Defend',
      'Determine',
      'Evaluate',
      'Estimate',
      'Explain',
      'Interpret',
      'Judge',
      'Justify',
      'Measure',
      'Predict',

      'Prioritize',
      'Prove',

      'Rank',
      'Rate',
      'Recommend',
      'Relate',
      'Revise',
      'Score',
      'Select',
      'Summarize',
      'Support',

      'Validate',
      'Value',
    ],
  },
]

const names = [
  'Maria Anders',
  'Ana Trujillo',
  'Antonio Moreno',
  'Thomas Hardy',
  'Christina Berglund',
  'Hanna Moos',
  'Frederique Citeaux',
  'Martin Sommer',
  'Laurence Lebihan',
  'Elizabeth Lincoln',
]

const getRandomDate = (): string => {
  const start = new Date(2020, 0, 1)
  const end = new Date()
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString()
}

const commentsByReason: Record<WhistleblowResourceReasonName, string[]> = {
  'Inappropriate content': [
    'The learning material contains explicit language that is not suitable for all ages.',
    'Images used in the resource are offensive and not in line with educational purposes.',
    'The examples in the tutorial include sensitive topics without proper warnings.',
    'Some of the content presented is disrespectful to certain groups and individuals.',
    'The language used in the course is derogatory and violates community standards.',
  ],
  'Copyright infringement': [
    'The resource includes chapters from a book that is not licensed for free distribution.',
    'Videos embedded in the course are copyrighted and have been uploaded without permission.',
    'The course content has been directly copied from a copyrighted website without credit.',
    'Images used in the tutorials are watermarked and sourced from a subscription service.',
    'The audio files provided for the language course are from a protected album.',
  ],
  'Misinformation or inaccuracy': [
    'The historical dates and events mentioned in the resource have several inaccuracies.',
    'Scientific facts presented in the module have been debunked by recent studies.',
    'The resource misrepresents statistical data which could mislead learners.',
    'The tutorial promotes health practices that are contrary to medical consensus.',
    'Legal advice given in the resource is outdated and potentially misleading.',
  ],
  'Spam or self-promotion': [
    'The course excessively promotes a product that the creator is selling elsewhere.',
    'The comment section is filled with links redirecting to a personal business site.',
    'Each lesson ends with a pitch to join a paid program unrelated to the course content.',
    'The resource description contains more promotional material than educational information.',
    'Multiple lessons within the course are disguised advertisements for a service.',
  ],
  'Irrelevant content': [
    'The module about astrophysics contains numerous lessons on personal finance.',
    'The resource digresses into topics that do not pertain to the subject matter.',
    'Several videos in the course are focused on the creator’s personal life rather than the topic.',
    'The worksheets provided include unrelated political opinions.',
    'The course title is about programming but the content covers cooking recipes.',
  ],
  'Other': [
    'The resource uses a proprietary format that is not accessible to all students.',
    'The course is supposed to be interactive but all the links to quizzes are broken.',
    'The description mentions several topics that are not actually covered in the content.',
    'The certification promised at the end of the course is not recognized by any institution.',
    'There are technical issues with the course that have not been addressed for several months.',
  ],
}

export const whistleblowOptions: WhistleblowResourceOptionType[] = [
  { id: '1', name: 'Inappropriate content' },
  { id: '2', name: 'Copyright infringement' },
  { id: '3', name: 'Misinformation or inaccuracy' },
  { id: '4', name: 'Spam or self-promotion' },
  { id: '5', name: 'Irrelevant content' },
  { id: '6', name: 'Other' },
]

// Utility function to get a random comment based on the reason
const getRandomComment = (reason: WhistleblowResourceReasonName): string => {
  const possibleComments = commentsByReason[reason]
  return possibleComments[Math.floor(Math.random() * possibleComments.length)] ?? ''
}

const getRandomReason = (): WhistleblowResourceReasonName => {
  const reasons: WhistleblowResourceReasonName[] = whistleblowOptions.map(reason => reason.name)

  return reasons[Math.floor(Math.random() * reasons.length)] ?? 'Other'
}

let emailCounter = 0

const generateRandomUserWhistleblow = (): WhistleblownResourceData => {
  emailCounter++
  const reason = getRandomReason()
  const randomUserReport: WhistleblownResourceData = {
    user: {
      avatarUrl: `https://i.pravatar.cc/150?img=${emailCounter}`,
      displayName: names[Math.floor(Math.random() * names.length)] || '',
      profileHref: href('Pages/Profile/Admin'),
    },
    date: new Date(getRandomDate()), // Convert the string to a Date object
    type: {
      id: Math.random().toString(36).substring(7),
      name: reason,
    },
    comment: Math.random() < 0.5 ? getRandomComment(reason) : undefined,
  }
  return randomUserReport
}

export const generateRandomUserWhistleblows = (n: number): WhistleblownResourceData[] => {
  const userWhistleblows: WhistleblownResourceData[] = []
  for (let i = 0; i < n; i++) {
    const randomUserReport = generateRandomUserWhistleblow()
    userWhistleblows.push(randomUserReport)
  }
  return userWhistleblows
}
