"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  setup: true
};
Object.defineProperty(exports, "setup", {
  enumerable: true,
  get: function get() {
    return _setup.setup;
  }
});

var _reactivity = require("@vue/reactivity");

Object.keys(_reactivity).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _reactivity[key];
    }
  });
});

var _setup = require("./setup");