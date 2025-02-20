import { resourceType, resourceTypeCode } from '../types'

export const eduResourceTypesSetup = eduResourceTypes()
function eduResourceTypes() {
  const resourceTypes: [code: resourceTypeCode, resourceType: resourceType][] = [
    ['assessment', { description: 'Assessment' }],
    ['concept-map', { description: 'Concept map' }],
    ['course', { description: 'Course' }],
    ['curriculum', { description: 'Curriculum' }],
    ['data-set', { description: 'Data set' }],
    ['experiment', { description: 'Experiment' }],
    ['game', { description: 'Game' }],
    ['glossary', { description: 'Glossary' }],
    ['graph', { description: 'Graph' }],
    ['guides-and-tutorials', { description: 'Guides and Tutorials' }],
    ['interactive-learning-object', { description: 'Interactive learning object' }],
    ['map', { description: 'Map' }],
    ['online-courses-site', { description: 'Online courses site' }],
    ['project', { description: 'Project' }],
    ['questionnaire', { description: 'Questionnaire' }],
    ['reading', { description: 'Reading' }],
    ['references', { description: 'References' }],
    ['report', { description: 'Report' }],
    ['repository', { description: 'Repository' }],
    ['simulation', { description: 'Simulation' }],
    ['unit-of-study', { description: 'Unit of study' }],
  ]
  return resourceTypes
}
