type Basic_License = { code: string; desc: string }

export default _licenses()
function _licenses(): Basic_License[] {
  return [
    { code: 'cc-0', desc: 'Public domain' },
    { code: 'cc-by', desc: 'Attribution' },
    { code: 'cc-by-sa', desc: 'Attribution + ShareAlike' },
    { code: 'cc-by-nc', desc: 'Attribution + NonCommercial' },
    { code: 'cc-by-nc-sa', desc: 'Attribution + NonCommercial + ShareAlike' },
    { code: 'cc-by-nd', desc: 'Attribution NonCommercial' },
    { code: 'cc-by-nc-nd', desc: 'Attribution + NonCommercial + NoDerivatives' },
    { code: 'other-open', desc: 'Other open license' },
    { code: 'restricted-copyright', desc: 'Restricted / copyrighted' },
  ]
}
