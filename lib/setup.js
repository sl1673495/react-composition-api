"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = void 0;

var _react = require("react");

var _reactivity = require("@vue/reactivity");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var setup = function setup(factory) {
  // 执行factory的过程中 会调用用户传入的setup
  // 在其中可以调用@vue/reactivity仓库里的api使用响应式能力
  var FunctionComponent = factory();

  var Wrapped = function Wrapped(props) {
    var forceUpdate = useForceUpdate(); // 将React生成组件的函数包裹在effect中开启观察
    // 在观察到的值更新以后利用forceUpdate来强制渲染

    var Component = null;
    var effection = (0, _reactivity.effect)(function () {
      Component = FunctionComponent(props);
    }, {
      scheduler: forceUpdate
    }); // 组件卸载后停止观察

    var stopEffect = function stopEffect() {
      (0, _reactivity.stop)(effection);
    };

    (0, _react.useEffect)(function () {
      return stopEffect;
    }, []);
    return Component;
  };

  return Wrapped;
};

exports.setup = setup;

var useForceUpdate = function useForceUpdate() {
  var _useReducer = (0, _react.useReducer)(function (s) {
    return s + 1;
  }, 0),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      forceUpdate = _useReducer2[1];

  return forceUpdate;
};