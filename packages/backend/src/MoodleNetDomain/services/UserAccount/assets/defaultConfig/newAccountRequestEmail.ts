export type NewAccountRequestEmailVars = {
  email: string
  link: string
}

const text = `Hello {{=it.email}}

Someone (probably you) signed up for a new MoodleNet account. 
If that was you, please click on the link below:
{{=it.link}}

Not you? Just ignore this message. 
`

const html = `<h3>Hello {{=it.email}}</h3>
<p>
  Someone (probably you) signed up for a new MoodleNet account. 
  If that was you, please click on the link below:
</p>
<p>
  <a href="{{=it.link}}">{{=it.link}}</a>
</p>
<p>
  Not you? Just ignore this message. 
</p>
`

export const newAccountRequestEmail = {
  text,
  html,
}
