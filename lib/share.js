"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useEffection = exports.useForceUpdate = void 0;

var _react = require("react");

var _reactivity = require("@vue/reactivity");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useForceUpdate = function useForceUpdate() {
  var _useReducer = (0, _react.useReducer)(function (s) {
    return s + 1;
  }, 0),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      forceUpdate = _useReducer2[1];

  return forceUpdate;
};

exports.useForceUpdate = useForceUpdate;

var useEffection = function useEffection() {
  // 用一个ref存储effection
  // effect函数只需要初始化执行一遍
  var effectionRef = (0, _react.useRef)();

  if (!effectionRef.current) {
    effectionRef.current = _reactivity.effect.apply(void 0, arguments);
  } // 卸载组件后取消effect


  var stopEffect = function stopEffect() {
    (0, _reactivity.stop)(effectionRef.current);
  };

  (0, _react.useEffect)(function () {
    return stopEffect;
  }, []);
  return effectionRef.current;
};

exports.useEffection = useEffection;