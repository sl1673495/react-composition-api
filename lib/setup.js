"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setup = void 0;

var _share = require("./share");

var setup = function setup(factory) {
  // 执行factory的过程中 会调用用户传入的setup
  // 在其中可以调用@vue/reactivity仓库里的api使用响应式能力
  var FunctionComponent = factory();

  var EffectWrapper = function EffectWrapper(props) {
    var forceUpdate = (0, _share.useForceUpdate)(); // 将React的FunctionComponent函数包裹在effect中执行 以收集依赖
    // 依赖值更新以后利用forceUpdate来强制重新渲染组件
    // effect只需要执行一次就够了

    var effection = (0, _share.useEffection)(function () {
      return FunctionComponent(props);
    }, {
      scheduler: forceUpdate,
      lazy: true
    }); // 生成组件实例

    var Component = effection();
    return Component;
  };

  return EffectWrapper;
};

exports.setup = setup;