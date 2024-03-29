import type { BloomCognitiveDataType } from '../../../../types.mjs'

export default bloomCognitiveDataType()
function bloomCognitiveDataType(): Record<string, Pick<BloomCognitiveDataType, 'name' | 'verbs'>> {
  return {
    '1': {
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
    '2': {
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
    '3': {
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
    '4': {
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
    '5': {
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
    '6': {
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
  }
}
