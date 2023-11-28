const data: [name: string, code: string][] = [
  ['Assessment', 'assessment'],
  ['Concept map', 'concept-map'],
  ['Course', 'course'],
  ['Curriculum', 'curriculum'],
  ['Data set', 'data-set'],
  ['Experiment', 'experiment'],
  ['Game', 'game'],
  ['Glossary', 'glossary'],
  ['Graph', 'graph'],
  ['Guides and Tutorials', 'guides-and-tutorials'],
  ['Interactive learning object', 'interactive-learning-object'],
  ['Map', 'map'],
  ['Online courses site', 'online-courses-site'],
  ['Project', 'project'],
  ['Questionnaire', 'questionnaire'],
  ['Reading', 'reading'],
  ['References', 'references'],
  ['Report', 'report'],
  ['Repository', 'repository'],
  ['Simulation', 'simulation'],
  ['Unit of study', 'unit-of-study'],
]

const openaiSystem = [
  `you are a specialist in categorizing an educational resource identifying what kind of resource is it`,
  `use the following resource-type code-mapping:
${data.map(([name, code]) => `"${code}": "${name}"`).join('\n')}`,
]
export default {
  data,
  openaiSystem,
}
