export type ChangeAccountEmailRequestEmailVars = {
  username: string
  link: string
}

const text = `Hello {{=it.username}}

Seems you requested to change your MoodleNet account email. 
If that was your intention, please click on the link below:
{{=it.link}}

Not you? Just ignore this message.
`

const html = `<h3>Hello {{=it.username}}</h3>
<p>
  Seems you requested to change your MoodleNet account email. 
  If that was your intention, please click on the link below:
</p>
<p>
  <a href="{{=it.link}}">{{=it.link}}</a>
</p>
<p>
  If this is not your intention just ignore this message. 
</p>
`

export const changeAccountEmailRequestEmail = {
  text,
  html,
}
