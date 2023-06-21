type Basic_License = { code: string; description: string; published: boolean }

export default _licenses()
function _licenses(): Basic_License[] {
  return [
    { code: 'cc-0', description: 'Public domain', published: true },
    { code: 'cc-by', description: 'Attribution', published: true },
    { code: 'cc-by-sa', description: 'Attribution + ShareAlike', published: true },
    { code: 'cc-by-nc', description: 'Attribution + NonCommercial', published: true },
    {
      code: 'cc-by-nc-sa',
      description: 'Attribution + NonCommercial + ShareAlike',
      published: true,
    },
    { code: 'cc-by-nd', description: 'Attribution NonCommercial', published: true },
    {
      code: 'cc-by-nc-nd',
      description: 'Attribution + NonCommercial + NoDerivatives',
      published: true,
    },
    { code: 'other-open', description: 'Other open license', published: false },
    { code: 'restricted-copyright', description: 'Restricted / copyrighted', published: false },
  ]
}
