import { bloomLearningOutcome, eduBloomCognitiveRecord } from '@moodle/module/edu'
import { Circle, HelpOutline } from '@mui/icons-material'
import type { RefObject } from 'react'
import { createRef, useEffect, useState, type FC } from 'react'
import { Dropdown, SimpleTextOption } from '../../../atoms/Dropdown/Dropdown'
import ErrorMessage from '../../../atoms/ErrorMessage/ErrorMessage'
import InputTextField from '../../../atoms/InputTextField/InputTextField'
import { RoundButton } from '../../../atoms/RoundButton/RoundButton'
import './LearningOutcomes.scss'

export type LearningOutcomesProps = {
  isEditing: boolean
  learningOutcomes: bloomLearningOutcome[]
  learningOutcomeRecords: eduBloomCognitiveRecord[]
  disabled?: boolean
  error?: string | string[]
  shouldShowErrors: boolean
  edit: (learningOutcomes: bloomLearningOutcome[]) => unknown
}

const MAX_LEARNING_OUTCOME_ITEMS = 4
function getBloomClassName(bloomLevel: string) {
  return (
    {
      '1': 'knowledge',
      '2': 'comprehension',
      '3': 'application',
      '4': 'analysis',
      '5': 'synthesis',
      '6': 'evaluation',
    }[bloomLevel] ?? ''
  )
}

export const LearningOutcomes: FC<LearningOutcomesProps> = ({
  learningOutcomeRecords,
  learningOutcomes,
  isEditing,
  disabled,
  error,
  shouldShowErrors,
  edit,
}) => {
  const deleteOutcome = (index: number) => {
    edit(learningOutcomes.filter((_, i) => i !== index))
  }

  const learningOutcomesList = learningOutcomes.length > 0 && (
    <div className="learning-outcomes-list" key="learning-outcomes-list">
      {learningOutcomes.map(({ level, verb, learningOutcome }, i) => {
        const learningOutcomeName = getLearningOutcomeName(level)
        const bloomUIClassName = getBloomClassName(level)
        return isEditing ? (
          <InputTextField
            className="learning-outcome"
            key={`${level}-${verb}-${i}`}
            name="content"
            placeholder={`the necessary facts...`}
            edit
            disabled={disabled}
            value={learningOutcome}
            onChange={value => {
              const newLearningOutcomes = [...learningOutcomes]
              const newLearningOutcome = newLearningOutcomes[i]
              if (!newLearningOutcome) {
                return
              }
              newLearningOutcome.learningOutcome = value.target.value
              edit(newLearningOutcomes)
            }}
            defaultValue={learningOutcome}
            leftSlot={
              <abbr className={`verb-pill ${bloomUIClassName}`} title={`${learningOutcomeName} Bloom's category`}>
                {verb}
              </abbr>
            }
            rightSlot={
              <RoundButton
                onClick={() => deleteOutcome(i)}
                tabIndex={0}
                disabled={disabled}
                abbrTitle={'Remove learning outcome'}
                onKeyUp={e => e.key === 'enter' && deleteOutcome(i)}
              />
            }
            error={shouldShowErrors && isEditing && Array.isArray(error) && error[i] !== '' ? error[i] : undefined}
          />
        ) : (
          learningOutcome !== '' && (
            <div className="learning-outcome-read-only">
              <Circle />
              <abbr className={`verb ${bloomUIClassName}`} title={`${learningOutcomeName} Bloom's category`}>
                {verb}
              </abbr>
              <div className="sentence">{learningOutcome}</div>
            </div>
          )
        )
      })}
    </div>
  )

  const [searchText, setSearchText] = useState('')

  const learningOutcomeCategoriesRefs: RefObject<HTMLDivElement>[] = learningOutcomeRecords.map(() => createRef())

  const categories = isEditing && (
    <div className="categories">
      {learningOutcomeRecords.map((learningOutcomeOption, i) => {
        const selectedVerb = learningOutcomes.find(outcome => outcome.level === learningOutcomeOption.level)
        const dropdownRef = learningOutcomeCategoriesRefs && learningOutcomeCategoriesRefs[i]
        const maxLearningOutcomesReached = learningOutcomes.length > MAX_LEARNING_OUTCOME_ITEMS
        return (
          <Dropdown
            key={learningOutcomeOption.level}
            divRef={dropdownRef}
            className={`category ${getBloomClassName(learningOutcomeOption.level)} ${selectedVerb ? 'active' : ''}
        ${maxLearningOutcomesReached ? 'max-reached' : ''}`}
            pills={false}
            disabled={maxLearningOutcomesReached || disabled}
            abbr={maxLearningOutcomesReached ? 'Max learning outcomes reached' : 'Add learning outcome'}
            placeholder={learningOutcomeOption.level}
            searchByText={setSearchText}
            onChange={changeEvent => {
              edit([
                ...learningOutcomes,
                {
                  level: learningOutcomeOption.level,
                  verb: changeEvent.target.value,
                  learningOutcome: '',
                },
              ])
            }}
            edit
          >
            {learningOutcomeOption.verbs
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
      <a href="https://en.wikipedia.org/wiki/Bloom%27s_taxonomy" target="_blank" rel="noopener noreferrer">
        <HelpOutline />
      </a>
    </abbr>
  )

  const title = (
    <div className="title">
      Learning outcomes
      {findOutMore}
    </div>
  )

  const subtitle = (
    <div className="subtitle">
      {isEditing
        ? 'Write 1 to 5 learning outcomes, selecting the right category and action verb:'
        : 'By reviewing this resource, learners will be able to:'}
    </div>
  )

  const errorDiv = isEditing && shouldShowErrors && error && typeof error === 'string' && <ErrorMessage error={error} />

  return (
    <div className={`learning-outcomes-section ${disabled ? 'disabled' : ''}`}>
      {title}
      {errorDiv}
      {subtitle}
      {categories}
      {learningOutcomesList}
    </div>
  )
  function getLearningOutcomeName(byLevel: string) {
    return learningOutcomeRecords.find(({ level }) => level === byLevel)?.description ?? 'unknown'
  }
}

LearningOutcomes.displayName = 'LearningOutcomes'
