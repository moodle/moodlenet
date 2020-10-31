var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand')

var myEnv = dotenv.config()
dotenvExpand(myEnv)
module.exports = {
  // namespace: "dev",
  // nodeID: "node-25",

  logger: true,
  logLevel: "info",
  logFormatter: "default",
  logObjectPrinter: null,

  // transporter: "nats://localhost:4222",

  requestTimeout: 5000,
  // retryPolicy: {
  //     enabled: true,
  //     retries: 5,
  //     delay: 100,
  //     maxDelay: 1000,
  //     factor: 2,
  //     check: err => err && !!err.retryable
  // },

  // contextParamsCloning: false,
  // maxCallLevel: 100,
  // heartbeatInterval: 5,
  // heartbeatTimeout: 15,

  // tracking: {
  //     enabled: true,
  //     shutdownTimeout: 5000,
  // },

  // disableBalancer: false,

  // registry: {
  //     strategy: "RoundRobin",
  //     preferLocal: true
  // },

  // circuitBreaker: {
  //     enabled: true,
  //     threshold: 0.5,
  //     windowTime: 60,
  //     minRequestCount: 20,
  //     halfOpenTime: 10 * 1000,
  //     check: err => err && err.code >= 500
  // },   

  // bulkhead: {
  //     enabled: true,
  //     concurrency: 10,
  //     maxQueueSize: 100,
  // },

  // transit: {
  //     maxQueueSize: 50 * 1000,
  //     disableReconnect: false,
  //     disableVersionCheck: false,
  //     packetLogFilter: ["HEARTBEAT"]
  // },

  // uidGenerator: null,

  // errorHandler: null,

  // cacher: "MemoryLRU",
  // serializer: "JSON",

  // validator: true,

  // metrics: {
  //     enabled: true,
  //     reporter: [
  //         "Console"
  //     ]
  // },

  // tracing: {
  //     enabled: true,
  //     exporter: [
  //         "Console"
  //     ]
  // },

  // internalServices: true,
  // internalMiddlewares: true,

  // hotReload: true,

  // middlewares: ["MyMiddleware"],

  // replCommands: [],

  // metadata: {
  //     region: "eu-west1"
  // },

  // skipProcessEventRegistration: false,

  // ServiceFactory: null,
  // ContextFactory: null,

  // created(broker) {},

  // started(broker) {},

  // stopped(broker) {}
}