export type TempSessionEmailVars = {
  username: string
  link: string
}
const text = `Hello {{=it.username}}

Someone (probably you) requested a password reset for your MoodleNet account. 
If that was you, please click on the link below:
{{=it.link}}

If this is not your intention just ignore this message. 
`

const html = `<h3>Hello {{=it.username}}</h3>
<p>
  Someone (probably you) requested a password reset for your MoodleNet account. 
  If that was you, please click on the link below:
</p>
<p>
  <a href="{{=it.link}}">{{=it.link}}</a>
</p>
<p>
  If this is not your intention just ignore this message. 
</p>
`
export const tempSessionEmail = {
  text,
  html,
}
