export type ChangeAccountEmailRequestEmailVars = {
  username: string
  link: string
}

const text = `Hello {{=it.username}} 

Seems you requested to change your MoodleNet account email. 

Please click on the link below to confirm or to cancel this request.
{{=it.link}}
`

const html = `<h3>Hello {{=it.username}}</h3>
<p>
  Seems you requested to change your MoodleNet account email. 
</p>
<p>
    Please click on the link below to confirm or to cancel this request.
</p>
<p>
  <a href="{{=it.link}}">{{=it.link}}</a>
</p>
`

export const changeAccountEmailRequestEmail = {
  text,
  html,
}
