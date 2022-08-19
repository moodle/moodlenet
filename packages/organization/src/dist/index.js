"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var path_1 = require("path");
var nodemailer_1 = require("./emailSender/nodemailer/nodemailer");
// come lo passo nel codice ?
var mailer = nodemailer_1.getNodemailerSendEmailAdapter({ smtp: 'smtp:moodlenet.com' });
var ext = {
    id: 'moodlenet-email-service@0.1.10',
    displayName: 'test ext',
    requires: ['moodlenet-core@0.1.10', 'moodlenet.react-app@0.1.10'],
    enable: function (shell) {
        // business logic, wire-up to the message system,
        // other packages integration
        //   listen to messages -> send other messages
        //    use other packages plugins (e.g add UI to react app, or add http-endpoint)
        // come lo passo
        // const mailer )getNodemailerSendEmailAdapter({smtp:'smtp:moodlenet.com'})
        shell.onExtInstance('moodlenet.react-app@0.1.10', function (inst) {
            console.log("moodlenet-email-service: onExtInstance<ReactAppExt>", inst);
            inst.setup({
                routes: {
                    moduleLoc: path_1.resolve(__dirname, '..', 'src', 'webapp', 'Router.tsx'),
                    rootPath: 'my-test'
                }
            });
        });
        shell.expose({
            // http://localhost:8080/_/_/raw-sub/moodlenet-email-service/0.1.10/_test  body:{"paramIn2": "33"}
            'send/sub': {
                validate: function ( /* data */) {
                    return { valid: true };
                }
            }
        });
        return {
            // code that allocate system resouces ( DB connections, listen to ports )
            // implement package's service messages
            deploy: function () {
                shell.lib.pubAll('moodlenet-email-service@0.1.10', shell, {
                    /* _test: ({
                      msg: {
                        data: {
                          req: { paramIn2 },
                        },
                      },
                    }) => { //returns ObservableInput<{ out2: number}> (from rxjs)
                     // return [{ out2: Number(paramIn2) }]
                     // return Promise.resolve({ out2: Number(paramIn2) })
                     // return shell.lib.rx.of({ out2: Number(paramIn2) })
                     return [{ out2: Number(paramIn2) }]
                    }, */
                    /*  async _test({
                      msg: {
                        data: {
                          req: { paramIn2 },
                        },
                      },
                    }) {
                      // call DB or call another service
                      // read fileasystem
                      return { out2: Number(paramIn2) }
                    }, */
                    send: function (_) {
                        return __awaiter(this, void 0, void 0, function () {
                            var resp;
                            return __generator(this, function (_a) {
                                resp = mailer({ from: 'me@me.it', to: 'to@to.it', body: '' });
                                if (!resp) {
                                    console.log('emailSender error on send mail');
                                }
                                return [2 /*return*/, resp.emailId];
                            });
                        });
                    }
                });
                return {};
            }
        };
    }
};
exports["default"] = { exts: [ext] };
