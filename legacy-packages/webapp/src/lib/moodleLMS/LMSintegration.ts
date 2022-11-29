export interface LMSPrefs {
  site: string
  course?: string
  section?: string
}

export const getUrlParamsFromEntryPointForMoodleLMS = (): LMSPrefs | null => {
  const q = new URLSearchParams(window.location.search)
  const site = q.get('site')
  if (!site) {
    return null
  }
  const course = q.get('course') || void 0
  const section = q.get('section') || void 0
  return {
    site,
    course,
    section,
  }
}

export const sendToMoodle = (
  resourceurl: string,
  resource_info: string,
  type: 'file' | 'link',
  { site, course, section }: LMSPrefs
) => {
  const form = document.createElement('form')
  form.target = '_blank'
  form.method = 'POST'
  form.action = `${site}/admin/tool/moodlenet/import.php`
  form.style.display = 'none'
  const params = {
    resourceurl,
    course,
    section,
    type,
    resource_info,
  }
  // console.table({site,...params})
  Object.entries(params).forEach(([name, val]) => {
    const hiddenField = document.createElement('input')
    hiddenField.type = 'hidden'
    hiddenField.name = name
    hiddenField.value = val || ''
    form.appendChild(hiddenField)
  })

  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}
