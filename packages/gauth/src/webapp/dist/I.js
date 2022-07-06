"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var moodlenet_react_1 = require("moodlenet-react");
var moodlenet_react_app_lib_1 = require("moodlenet-react-app-lib");
var MainLayout = moodlenet_react_app_lib_1["default"].ui.components.layout.MainLayout;
var Index = function () {
    var _a = moodlenet_react_1.useState(), urlAuth = _a[0], setUrlAuth = _a[1];
    var testStr = moodlenet_react_app_lib_1["default"].useTest('iindex').join('---');
    moodlenet_react_1.useEffect(function () {
        axios_1["default"].get('http://localhost:3000/_/moodlenet-gauth/auth/google/url')
            .then(function (res) { return setUrlAuth(res.data); })["catch"](function (error) {
            console.error("Failed to fetch auth tokens");
            throw new Error(error.message);
        });
    }, []);
    return (React.createElement(MainLayout, null,
        React.createElement("h2", null,
            "B Etto ext Page ",
            urlAuth),
        React.createElement("div", { className: "App" }, React.createElement("a", { href: urlAuth }, "LOGIN WITH GOOGLE"))));
};
exports["default"] = Index;
