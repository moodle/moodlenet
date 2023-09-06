import {
  Dropdown,
  ErrorMessage,
  InputTextField,
  RoundButton,
  SimpleTextOption,
} from '@moodlenet/component-library'
import { Circle, HelpOutline } from '@mui/icons-material'
import type { RefObject } from 'react'
import { createRef, useEffect, useState, type FC } from 'react'
import './LearningOutcomes.scss'

export type LearningOutcomeCategoryName =
  | 'Knowledge'
  | 'Comprehension'
  | 'Application'
  | 'Analysis'
  | 'Synthesis'
  | 'Evaluation'

export type LearningOutcomeCategory = {
  name: LearningOutcomeCategoryName
  verbs: string[]
}
const learningOutcomeCategories: LearningOutcomeCategory[] = [
  {
    name: 'Knowledge',
    verbs: [
      'Define',
      'Describe',
      'Identify',
      'Label',
      'List',
      'Match',
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
    name: 'Comprehension',
    verbs: [
      'Classify',
      'Convert',
      'Defend',
      'Describe',
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
      'Summarize',
      'Translate',
      'Visualize',
    ],
  },
  {
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
    ],
  },
  {
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
      'Inventory',
      'Investigate',
      'Outline',
      'Question',
      'Relate',
      'Select',
      'Separate',
      'Subdivide',
    ],
  },
  {
    name: 'Synthesis',
    verbs: [
      'Arrange',
      'Assemble',
      'Categorize',
      'Collect',
      'Combine',
      'Comply',
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
      'Manage',
      'Modify',
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
      'Deduce',
      'Defend',
      'Determine',
      'Disprove',
      'Estimate',
      'Evaluate',
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
      'Value',
    ],
  },
]
export type LearningOutcome = {
  category: LearningOutcomeCategoryName
  verb: string
  sentence: string
}

export type LearningOutcomesProps = {
  isEditing: boolean
  learningOutcomes: LearningOutcome[]
  error?: string | string[]
  shouldShowErrors: boolean
  edit: (learningOutcomes: LearningOutcome[]) => unknown
}

export const LearningOutcomes: FC<LearningOutcomesProps> = ({
  learningOutcomes,
  isEditing,
  error,
  shouldShowErrors,
  edit,
}) => {
  const deleteOutcome = (index: number) => {
    edit(learningOutcomes.filter((_, i) => i !== index))
  }

  const learningOutcomesList = learningOutcomes.length > 0 && (
    <div className="learning-outcomes-list" key="learning-outcomes-list">
      {learningOutcomes.map(({ category, verb, sentence }, i) =>
        isEditing ? (
          <InputTextField
            className="learning-outcome"
            key={`${category}-${verb}-${i}`}
            name="content"
            placeholder={`a problem using the systemic conceptual method`}
            edit
            value={sentence}
            onChange={value => {
              const newLearningOutcomes = [...learningOutcomes]
              const newLearningOutcome = newLearningOutcomes[i]
              if (!newLearningOutcome) {
                return
              }
              newLearningOutcome.sentence = value.target.value
              edit(newLearningOutcomes)
            }}
            defaultValue={sentence}
            leftSlot={
              <abbr
                className={`verb-pill ${category.toLowerCase()}`}
                title={`${category} Bloom's category`}
              >
                {verb}
              </abbr>
            }
            rightSlot={
              <RoundButton
                onClick={() => deleteOutcome(i)}
                tabIndex={0}
                abbrTitle={'Remove learning outcome'}
                onKeyUp={{ key: 'Enter', func: () => deleteOutcome(i) }}
              />
            }
            error={
              shouldShowErrors && isEditing && Array.isArray(error) && error[i] !== ''
                ? error[i]
                : undefined
            }
          />
        ) : (
          sentence !== '' && (
            <div className="learning-outcome-read-only">
              <Circle />
              <abbr
                className={`verb ${category.toLowerCase()}`}
                title={`${category} Bloom's category`}
              >
                <a
                  href="https://en.wikipedia.org/wiki/Bloom%27s_taxonomy#:~:text=Bloom's%20taxonomy%20is%20a%20set,cognitive%2C%20affective%20and%20psychomotor%20domains."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {verb}
                </a>
              </abbr>{' '}
              <div className="sentence">{sentence}</div>
            </div>
          )
        ),
      )}
    </div>
  )

  const [searchText, setSearchText] = useState('')

  const learningOutcomeCategoriesRefs: RefObject<HTMLDivElement>[] = learningOutcomeCategories.map(
    () => createRef(),
  )

  const categories = isEditing && (
    <div className="categories">
      {learningOutcomeCategories.map((category, i) => {
        const selectedVerb = learningOutcomes.find(outcome => outcome.category === category.name)
        const dropdownRef = learningOutcomeCategoriesRefs && learningOutcomeCategoriesRefs[i]
        return (
          <Dropdown
            key={category.name}
            divRef={dropdownRef}
            className={`category ${category.name.toLowerCase()} ${selectedVerb ? 'active' : ''}
        ${learningOutcomes.length > 4 ? 'max-reached' : ''}`}
            pills={false}
            disabled={learningOutcomes.length > 4}
            abbr={
              learningOutcomes.length > 4 ? 'Max learning outcomes reached' : 'Add learning outcome'
            }
            placeholder={category.name}
            searchByText={setSearchText}
            onChange={value => {
              edit([
                ...learningOutcomes,
                {
                  category: category.name,
                  verb: value.target.value,
                  sentence: '',
                },
              ])
            }}
            edit
          >
            {category.verbs
              .filter(verb => verb.toUpperCase().includes(searchText.toUpperCase()))
              .map(verb => {
                return <SimpleTextOption key={verb} value={verb} />
              })}
          </Dropdown>
        )
      })}
    </div>
  )

  useEffect(() => {
    learningOutcomeCategoriesRefs.forEach(ref => {
      const element = ref.current
      if (element) element.style.width = `${ref.current?.clientWidth}px`
    })
  }, [learningOutcomeCategoriesRefs])

  const findOutMore = (
    <abbr className="find-out-more" title="Find out more">
      <a
        href="https://en.wikipedia.org/wiki/Bloom%27s_taxonomy#:~:text=Bloom's%20taxonomy%20is%20a%20set,cognitive%2C%20affective%20and%20psychomotor%20domains."
        target="_blank"
        rel="noopener noreferrer"
      >
        <HelpOutline />
      </a>
    </abbr>
  )

  const title = (
    <div className="title">
      Learning outcomes
      {isEditing && findOutMore}
    </div>
  )

  const subtitle = (
    <div className="subtitle">
      {isEditing
        ? 'Write 1 to 5 learning outcomes, selecting the right category and action verb:'
        : 'By reviewing this resource, learners will be able to:'}
    </div>
  )

  const errorDiv = isEditing && shouldShowErrors && error && typeof error === 'string' && (
    <ErrorMessage error={error} />
  )

  return (
    <div className="learning-outcomes-section">
      {title}
      {errorDiv}
      {subtitle}
      {categories}
      {learningOutcomesList}
    </div>
  )
}

LearningOutcomes.displayName = 'LearningOutcomes'
