const css = `

body > h1 {
  font-size: 60px;
  color: pink;
}
body > p {
  font-size: 20px;
  padding: 15px 0;
}

`

export const RecoverPasswordEmail = 
  <html>
    <head>
      <title></title>
      <style>{css}</style>
    </head>
    <body>
      <div ></div>
      <div ></div>
      <p>
        Someone (probably you) requested a paaword change on MoodleNet. If that was you, please click on the link below:
      </p>
      <p>
        <a href="{{=it.link}}">www.dsaadfdsf.com</a>
      </p>
      <p>and choose a new password for your account</p>
      <p>Not you? Just ignore this message.</p>
    </body>
  </html>


export default RecoverPasswordEmail
