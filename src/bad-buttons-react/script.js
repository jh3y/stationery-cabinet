"use strict";
exports.__esModule = true;
// @ts-ignore
var react_1 = require("https://cdn.skypack.dev/react");
// @ts-ignore
var react_dom_1 = require("https://cdn.skypack.dev/react-dom");
var ROOT_NODE = document.getElementById('app');
var BadButton = function () {
    return react_1["default"].createElement("button", null, "Click me now!");
};
var App = function () { return (react_1["default"].createElement(react_1["default"].Fragment, null,
    react_1["default"].createElement(BadButton, null))); };
(0, react_dom_1.render)(react_1["default"].createElement(App, null), ROOT_NODE);
