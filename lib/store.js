"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Provider = exports.useStore = void 0;

var _react = _interopRequireWildcard(require("react"));

var _share = require("./share");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var StoreContext = _react.default.createContext(null);

var useStoreContext = function useStoreContext() {
  var contextValue = (0, _react.useContext)(StoreContext);

  if (!contextValue) {
    throw new Error('could not find store context value; please ensure the component is wrapped in a <Provider>');
  }

  return contextValue;
};
/**
 * 在组件中读取全局状态
 * 需要通过传入的函数收集依赖
 */


var useStore = function useStore(selector) {
  var forceUpdate = (0, _share.useForceUpdate)();
  var store = useStoreContext();
  var effection = (0, _share.useEffection)(function () {
    return selector(store);
  }, {
    scheduler: function scheduler(job) {
      if (job() === undefined) return;
      forceUpdate();
    },
    lazy: true
  });
  var value = effection();
  return value;
};

exports.useStore = useStore;
var Provider = StoreContext.Provider;
exports.Provider = Provider;