type Basic_Type = { code: string; desc: string }

export default types()
function types(): Basic_Type[] {
  return [
    { code: 'assessment', desc: 'assessment / self-assessment / exercise' },
    { code: 'graph', desc: 'diagram / graph / concept map' },
    { code: 'guides', desc: 'guides / tutorials' },
    { code: 'narrative-text', desc: 'narrative text' },
    { code: 'problem-statement', desc: 'problem statement' },
    { code: 'experiment', desc: 'experiment' },
    { code: 'figure', desc: 'figure' },
    { code: 'game', desc: 'game' },
    { code: 'index', desc: 'index' },
    { code: 'lecture', desc: 'lecture' },
    { code: 'map', desc: 'map' },
    { code: 'questionnaire', desc: 'questionnaire' },
    { code: 'references', desc: 'references' },
    { code: 'reports', desc: 'reports' },
    { code: 'simulation', desc: 'simulation' },
    { code: 'slide', desc: 'slide' },
    { code: 'table', desc: 'table' },
  ]
}
