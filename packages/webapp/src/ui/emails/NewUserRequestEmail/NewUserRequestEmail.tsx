const css = `
body {
  background-color: rgb(244, 245, 247);
}

#email-header {
  width: 100%;
  height: 60px;
  padding: 0 40px;
  background-color: white;
  box-shadow: 0 2px 4px 0 rgb(0 0 0 / 10%);
  display: flex;
  justify-content: center;
}

#email-header-content {
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

#logo {
  height: 28px;
}

#email-content {
  width: 100%;
  padding: 40px;
  display: flex;
  justify-content: center;
}

#email-card {
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 0 6px #dedede;
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  align-items: center;
}

#email-title {
  font-size: 18px;
  font-weight: bold;
}

#email-message {
  font-size: 14px;
  line-height: 20px;
}

#primary-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 45px;
  font-weight: bold;
  font-size: 12px;
  height: 30px;
  padding: 12px 18px;
  width: fit-content;
  cursor: pointer;
  color: white;
  background-color: #f88012;
  white-space: nowrap;
}

#primary-button:hover {
  background-color: #337aff;
}

#email-disclaimer {
  font-size: 12px;
  color: #a3a6b5;
}
`

export const NewUserRequestEmail = (
  <html>
    <head>
      <title></title>
      <style>{css}</style>
    </head>
    <body>
      <div id="email-header">
        <div id="email-header-content">
          <a id="logo" href="https://moodle.net">
            <img id="logo" src="https://moodle.net/static/media/moodlenet-logo.13b42822.svg" alt="Logo" />
          </a>
        </div>
      </div>
      <div id="email-content">
        <div id="email-card">
          <div id="email-title">Welcome to MoodleNet</div>
          <div id="email-message">
          Thanks for signing up to MoodleNet! Click the button below to activate your account:
          </div>
          <a id="primary-button" href="{{=it.link}}">
            Activate account
          </a>
          <div id="email-disclaimer">Not you? Just ignore this message.</div>
        </div>
      </div>
    </body>
  </html>
)

export default NewUserRequestEmail
