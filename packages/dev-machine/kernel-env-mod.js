module.exports = {
  "kernel.core.node": {
    "activatePkgs": [
      "@moodlenet/webapp",
      "@moodlenet/pri-http",
      "@moodlenet/test-extension",
    ]
  }
  ,
  "kernel.core": {},
  "moodlenet.pri-http": {
    "port": 8888
  }
}
