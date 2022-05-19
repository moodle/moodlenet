module.exports = {
  "kernel.core.node": {
    "activatePkgs": [
      "@moodlenet/test-extension",
      "@moodlenet/react-app",
      "@moodlenet/pri-http",
    ]
  }
  ,
  "kernel.core": {},
  "moodlenet.pri-http": {
    "port": 8888
  }
}
