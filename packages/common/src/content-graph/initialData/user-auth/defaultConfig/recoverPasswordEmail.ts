const text = `Hello 

Someone (probably you) requested a password change on MoodleNet. 
If that was you, please click on the link below:
{{=it.link}}
and choose a new password for your account

Not you? Just ignore this message. 
`

const html = `<h3>Hello</h3>
<p>
Someone (probably you) requested a paaword change on MoodleNet. 
If that was you, please click on the link below:
</p>
<p>
  <a href="{{=it.link}}">{{=it.link}}</a>
</p>
<p>
and choose a new password for your account
</p>
<p>
  Not you? Just ignore this message. 
</p>
`

export const recoverPasswordEmail = {
  text,
  html,
}
