// Make a map and return a function for checking if a key
// is in that map.
//
// IMPORTANT: all calls of this function must be prefixed with /*#__PURE__*/
// So that rollup can tree-shake them if necessary.
function makeMap(str, expectsLowerCase) {
    const map = Object.create(null);
    const list = str.split(',');
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val];
}

const EMPTY_OBJ =  Object.freeze({})
    ;
const extend = (a, b) => {
    for (const key in b) {
        a[key] = b[key];
    }
    return a;
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isFunction = (val) => typeof val === 'function';
const isSymbol = (val) => typeof val === 'symbol';
const isObject = (val) => val !== null && typeof val === 'object';
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
function toRawType(value) {
    return toTypeString(value).slice(8, -1);
}
function cacheStringFunction(fn) {
    const cache = Object.create(null);
    return ((str) => {
        const hit = cache[str];
        return hit || (cache[str] = fn(str));
    });
}
const capitalize = cacheStringFunction((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
});
// compare whether a value has changed, accounting for NaN.
const hasChanged = (value, oldValue) => value !== oldValue && (value === value || oldValue === oldValue);

const targetMap = new WeakMap();
const effectStack = [];
let activeEffect;
const ITERATE_KEY = Symbol('iterate');
function isEffect(fn) {
    return fn != null && fn._isEffect === true;
}
function effect(fn, options = EMPTY_OBJ) {
    if (isEffect(fn)) {
        fn = fn.raw;
    }
    const effect = createReactiveEffect(fn, options);
    if (!options.lazy) {
        effect();
    }
    return effect;
}
function stop(effect) {
    if (effect.active) {
        cleanup(effect);
        if (effect.options.onStop) {
            effect.options.onStop();
        }
        effect.active = false;
    }
}
function createReactiveEffect(fn, options) {
    const effect = function reactiveEffect(...args) {
        return run(effect, fn, args);
    };
    effect._isEffect = true;
    effect.active = true;
    effect.raw = fn;
    effect.deps = [];
    effect.options = options;
    return effect;
}
function run(effect, fn, args) {
    if (!effect.active) {
        return fn(...args);
    }
    if (!effectStack.includes(effect)) {
        cleanup(effect);
        try {
            effectStack.push(effect);
            activeEffect = effect;
            return fn(...args);
        }
        finally {
            effectStack.pop();
            activeEffect = effectStack[effectStack.length - 1];
        }
    }
}
function cleanup(effect) {
    const { deps } = effect;
    if (deps.length) {
        for (let i = 0; i < deps.length; i++) {
            deps[i].delete(effect);
        }
        deps.length = 0;
    }
}
let shouldTrack = true;
function pauseTracking() {
    shouldTrack = false;
}
function resumeTracking() {
    shouldTrack = true;
}
function track(target, type, key) {
    if (!shouldTrack || activeEffect === undefined) {
        return;
    }
    let depsMap = targetMap.get(target);
    if (depsMap === void 0) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (dep === void 0) {
        depsMap.set(key, (dep = new Set()));
    }
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
        activeEffect.deps.push(dep);
        if ( activeEffect.options.onTrack) {
            activeEffect.options.onTrack({
                effect: activeEffect,
                target,
                type,
                key
            });
        }
    }
}
function trigger(target, type, key, extraInfo) {
    const depsMap = targetMap.get(target);
    if (depsMap === void 0) {
        // never been tracked
        return;
    }
    const effects = new Set();
    const computedRunners = new Set();
    if (type === "clear" /* CLEAR */) {
        // collection being cleared, trigger all effects for target
        depsMap.forEach(dep => {
            addRunners(effects, computedRunners, dep);
        });
    }
    else {
        // schedule runs for SET | ADD | DELETE
        if (key !== void 0) {
            addRunners(effects, computedRunners, depsMap.get(key));
        }
        // also run for iteration key on ADD | DELETE
        if (type === "add" /* ADD */ || type === "delete" /* DELETE */) {
            const iterationKey = isArray(target) ? 'length' : ITERATE_KEY;
            addRunners(effects, computedRunners, depsMap.get(iterationKey));
        }
    }
    const run = (effect) => {
        scheduleRun(effect, target, type, key, extraInfo);
    };
    // Important: computed effects must be run first so that computed getters
    // can be invalidated before any normal effects that depend on them are run.
    computedRunners.forEach(run);
    effects.forEach(run);
}
function addRunners(effects, computedRunners, effectsToAdd) {
    if (effectsToAdd !== void 0) {
        effectsToAdd.forEach(effect => {
            if (effect.options.computed) {
                computedRunners.add(effect);
            }
            else {
                effects.add(effect);
            }
        });
    }
}
function scheduleRun(effect, target, type, key, extraInfo) {
    if ( effect.options.onTrigger) {
        const event = {
            effect,
            target,
            key,
            type
        };
        effect.options.onTrigger(extraInfo ? extend(event, extraInfo) : event);
    }
    if (effect.options.scheduler !== void 0) {
        effect.options.scheduler(effect);
    }
    else {
        effect();
    }
}

// global immutability lock
let LOCKED = true;
function lock() {
    LOCKED = true;
}
function unlock() {
    LOCKED = false;
}

const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol)
    .map(key => Symbol[key])
    .filter(isSymbol));
const get = /*#__PURE__*/ createGetter();
const readonlyGet = /*#__PURE__*/ createGetter(true);
const shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true);
const arrayIdentityInstrumentations = {};
['includes', 'indexOf', 'lastIndexOf'].forEach(key => {
    arrayIdentityInstrumentations[key] = function (value, ...args) {
        return toRaw(this)[key](toRaw(value), ...args);
    };
});
function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        if (isArray(target) && hasOwn(arrayIdentityInstrumentations, key)) {
            return Reflect.get(arrayIdentityInstrumentations, key, receiver);
        }
        const res = Reflect.get(target, key, receiver);
        if (isSymbol(key) && builtInSymbols.has(key)) {
            return res;
        }
        if (shallow) {
            track(target, "get" /* GET */, key);
            // TODO strict mode that returns a shallow-readonly version of the value
            return res;
        }
        if (isRef(res)) {
            return res.value;
        }
        track(target, "get" /* GET */, key);
        return isObject(res)
            ? isReadonly
                ? // need to lazy access readonly and reactive here to avoid
                    // circular dependency
                    readonly(res)
                : reactive(res)
            : res;
    };
}
const set = /*#__PURE__*/ createSetter();
const readonlySet = /*#__PURE__*/ createSetter(true);
const shallowReadonlySet = /*#__PURE__*/ createSetter(true, true);
function createSetter(isReadonly = false, shallow = false) {
    return function set(target, key, value, receiver) {
        if (isReadonly && LOCKED) {
            {
                console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
            }
            return true;
        }
        const oldValue = target[key];
        if (!shallow) {
            value = toRaw(value);
            if (isRef(oldValue) && !isRef(value)) {
                oldValue.value = value;
                return true;
            }
        }
        const hadKey = hasOwn(target, key);
        const result = Reflect.set(target, key, value, receiver);
        // don't trigger if target is something up in the prototype chain of original
        if (target === toRaw(receiver)) {
            /* istanbul ignore else */
            {
                const extraInfo = { oldValue, newValue: value };
                if (!hadKey) {
                    trigger(target, "add" /* ADD */, key, extraInfo);
                }
                else if (hasChanged(value, oldValue)) {
                    trigger(target, "set" /* SET */, key, extraInfo);
                }
            }
        }
        return result;
    };
}
function deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
        /* istanbul ignore else */
        {
            trigger(target, "delete" /* DELETE */, key, { oldValue });
        }
    }
    return result;
}
function has(target, key) {
    const result = Reflect.has(target, key);
    track(target, "has" /* HAS */, key);
    return result;
}
function ownKeys(target) {
    track(target, "iterate" /* ITERATE */, ITERATE_KEY);
    return Reflect.ownKeys(target);
}
const mutableHandlers = {
    get,
    set,
    deleteProperty,
    has,
    ownKeys
};
const readonlyHandlers = {
    get: readonlyGet,
    set: readonlySet,
    has,
    ownKeys,
    deleteProperty(target, key) {
        if (LOCKED) {
            {
                console.warn(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
            }
            return true;
        }
        else {
            return deleteProperty(target, key);
        }
    }
};
// props handlers are special in the sense that it should not unwrap top-level
// refs (in order to allow refs to be explicitly passed down), but should
// retain the reactivity of the normal readonly object.
const shallowReadonlyHandlers = {
    ...readonlyHandlers,
    get: shallowReadonlyGet,
    set: shallowReadonlySet
};

const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target, key, wrap) {
    target = toRaw(target);
    key = toRaw(key);
    track(target, "get" /* GET */, key);
    return wrap(getProto(target).get.call(target, key));
}
function has$1(key) {
    const target = toRaw(this);
    key = toRaw(key);
    track(target, "has" /* HAS */, key);
    return getProto(target).has.call(target, key);
}
function size(target) {
    target = toRaw(target);
    track(target, "iterate" /* ITERATE */, ITERATE_KEY);
    return Reflect.get(getProto(target), 'size', target);
}
function add(value) {
    value = toRaw(value);
    const target = toRaw(this);
    const proto = getProto(target);
    const hadKey = proto.has.call(target, value);
    const result = proto.add.call(target, value);
    if (!hadKey) {
        /* istanbul ignore else */
        {
            trigger(target, "add" /* ADD */, value, { newValue: value });
        }
    }
    return result;
}
function set$1(key, value) {
    value = toRaw(value);
    key = toRaw(key);
    const target = toRaw(this);
    const proto = getProto(target);
    const hadKey = proto.has.call(target, key);
    const oldValue = proto.get.call(target, key);
    const result = proto.set.call(target, key, value);
    /* istanbul ignore else */
    {
        const extraInfo = { oldValue, newValue: value };
        if (!hadKey) {
            trigger(target, "add" /* ADD */, key, extraInfo);
        }
        else if (hasChanged(value, oldValue)) {
            trigger(target, "set" /* SET */, key, extraInfo);
        }
    }
    return result;
}
function deleteEntry(key) {
    key = toRaw(key);
    const target = toRaw(this);
    const proto = getProto(target);
    const hadKey = proto.has.call(target, key);
    const oldValue = proto.get ? proto.get.call(target, key) : undefined;
    // forward the operation before queueing reactions
    const result = proto.delete.call(target, key);
    if (hadKey) {
        /* istanbul ignore else */
        {
            trigger(target, "delete" /* DELETE */, key, { oldValue });
        }
    }
    return result;
}
function clear() {
    const target = toRaw(this);
    const hadItems = target.size !== 0;
    const oldTarget =  target instanceof Map
            ? new Map(target)
            : new Set(target)
        ;
    // forward the operation before queueing reactions
    const result = getProto(target).clear.call(target);
    if (hadItems) {
        /* istanbul ignore else */
        {
            trigger(target, "clear" /* CLEAR */, void 0, { oldTarget });
        }
    }
    return result;
}
function createForEach(isReadonly) {
    return function forEach(callback, thisArg) {
        const observed = this;
        const target = toRaw(observed);
        const wrap = isReadonly ? toReadonly : toReactive;
        track(target, "iterate" /* ITERATE */, ITERATE_KEY);
        // important: create sure the callback is
        // 1. invoked with the reactive map as `this` and 3rd arg
        // 2. the value received should be a corresponding reactive/readonly.
        function wrappedCallback(value, key) {
            return callback.call(observed, wrap(value), wrap(key), observed);
        }
        return getProto(target).forEach.call(target, wrappedCallback, thisArg);
    };
}
function createIterableMethod(method, isReadonly) {
    return function (...args) {
        const target = toRaw(this);
        const isPair = method === 'entries' ||
            (method === Symbol.iterator && target instanceof Map);
        const innerIterator = getProto(target)[method].apply(target, args);
        const wrap = isReadonly ? toReadonly : toReactive;
        track(target, "iterate" /* ITERATE */, ITERATE_KEY);
        // return a wrapped iterator which returns observed versions of the
        // values emitted from the real iterator
        return {
            // iterator protocol
            next() {
                const { value, done } = innerIterator.next();
                return done
                    ? { value, done }
                    : {
                        value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
                        done
                    };
            },
            // iterable protocol
            [Symbol.iterator]() {
                return this;
            }
        };
    };
}
function createReadonlyMethod(method, type) {
    return function (...args) {
        if (LOCKED) {
            {
                const key = args[0] ? `on key "${args[0]}" ` : ``;
                console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
            }
            return type === "delete" /* DELETE */ ? false : this;
        }
        else {
            return method.apply(this, args);
        }
    };
}
const mutableInstrumentations = {
    get(key) {
        return get$1(this, key, toReactive);
    },
    get size() {
        return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false)
};
const readonlyInstrumentations = {
    get(key) {
        return get$1(this, key, toReadonly);
    },
    get size() {
        return size(this);
    },
    has: has$1,
    add: createReadonlyMethod(add, "add" /* ADD */),
    set: createReadonlyMethod(set$1, "set" /* SET */),
    delete: createReadonlyMethod(deleteEntry, "delete" /* DELETE */),
    clear: createReadonlyMethod(clear, "clear" /* CLEAR */),
    forEach: createForEach(true)
};
const iteratorMethods = ['keys', 'values', 'entries', Symbol.iterator];
iteratorMethods.forEach(method => {
    mutableInstrumentations[method] = createIterableMethod(method, false);
    readonlyInstrumentations[method] = createIterableMethod(method, true);
});
function createInstrumentationGetter(instrumentations) {
    return (target, key, receiver) => Reflect.get(hasOwn(instrumentations, key) && key in target
        ? instrumentations
        : target, key, receiver);
}
const mutableCollectionHandlers = {
    get: createInstrumentationGetter(mutableInstrumentations)
};
const readonlyCollectionHandlers = {
    get: createInstrumentationGetter(readonlyInstrumentations)
};

// WeakMaps that store {raw <-> observed} pairs.
const rawToReactive = new WeakMap();
const reactiveToRaw = new WeakMap();
const rawToReadonly = new WeakMap();
const readonlyToRaw = new WeakMap();
// WeakSets for values that are marked readonly or non-reactive during
// observable creation.
const readonlyValues = new WeakSet();
const nonReactiveValues = new WeakSet();
const collectionTypes = new Set([Set, Map, WeakMap, WeakSet]);
const isObservableType = /*#__PURE__*/ makeMap('Object,Array,Map,Set,WeakMap,WeakSet');
const canObserve = (value) => {
    return (!value._isVue &&
        !value._isVNode &&
        isObservableType(toRawType(value)) &&
        !nonReactiveValues.has(value));
};
function reactive(target) {
    // if trying to observe a readonly proxy, return the readonly version.
    if (readonlyToRaw.has(target)) {
        return target;
    }
    // target is explicitly marked as readonly by user
    if (readonlyValues.has(target)) {
        return readonly(target);
    }
    return createReactiveObject(target, rawToReactive, reactiveToRaw, mutableHandlers, mutableCollectionHandlers);
}
function readonly(target) {
    // value is a mutable observable, retrieve its original and return
    // a readonly version.
    if (reactiveToRaw.has(target)) {
        target = reactiveToRaw.get(target);
    }
    return createReactiveObject(target, rawToReadonly, readonlyToRaw, readonlyHandlers, readonlyCollectionHandlers);
}
// @internal
// Return a reactive-copy of the original object, where only the root level
// properties are readonly, and does not recursively convert returned properties.
// This is used for creating the props proxy object for stateful components.
function shallowReadonly(target) {
    return createReactiveObject(target, rawToReadonly, readonlyToRaw, shallowReadonlyHandlers, readonlyCollectionHandlers);
}
function createReactiveObject(target, toProxy, toRaw, baseHandlers, collectionHandlers) {
    if (!isObject(target)) {
        {
            console.warn(`value cannot be made reactive: ${String(target)}`);
        }
        return target;
    }
    // target already has corresponding Proxy
    let observed = toProxy.get(target);
    if (observed !== void 0) {
        return observed;
    }
    // target is already a Proxy
    if (toRaw.has(target)) {
        return target;
    }
    // only a whitelist of value types can be observed.
    if (!canObserve(target)) {
        return target;
    }
    const handlers = collectionTypes.has(target.constructor)
        ? collectionHandlers
        : baseHandlers;
    observed = new Proxy(target, handlers);
    toProxy.set(target, observed);
    toRaw.set(observed, target);
    return observed;
}
function isReactive(value) {
    return reactiveToRaw.has(value) || readonlyToRaw.has(value);
}
function isReadonly(value) {
    return readonlyToRaw.has(value);
}
function toRaw(observed) {
    return reactiveToRaw.get(observed) || readonlyToRaw.get(observed) || observed;
}
function markReadonly(value) {
    readonlyValues.add(value);
    return value;
}
function markNonReactive(value) {
    nonReactiveValues.add(value);
    return value;
}

const convert = (val) => isObject(val) ? reactive(val) : val;
function isRef(r) {
    return r ? r._isRef === true : false;
}
function ref(raw) {
    if (isRef(raw)) {
        return raw;
    }
    raw = convert(raw);
    const r = {
        _isRef: true,
        get value() {
            track(r, "get" /* GET */, 'value');
            return raw;
        },
        set value(newVal) {
            raw = convert(newVal);
            trigger(r, "set" /* SET */, 'value',  { newValue: newVal } );
        }
    };
    return r;
}
function toRefs(object) {
    if ( !isReactive(object)) {
        console.warn(`toRefs() expects a reactive object but received a plain one.`);
    }
    const ret = {};
    for (const key in object) {
        ret[key] = toProxyRef(object, key);
    }
    return ret;
}
function toProxyRef(object, key) {
    return {
        _isRef: true,
        get value() {
            return object[key];
        },
        set value(newVal) {
            object[key] = newVal;
        }
    };
}

function computed(getterOrOptions) {
    let getter;
    let setter;
    if (isFunction(getterOrOptions)) {
        getter = getterOrOptions;
        setter =  () => {
                console.warn('Write operation failed: computed value is readonly');
            }
            ;
    }
    else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }
    let dirty = true;
    let value;
    const runner = effect(getter, {
        lazy: true,
        // mark effect as computed so that it gets priority during trigger
        computed: true,
        scheduler: () => {
            dirty = true;
        }
    });
    return {
        _isRef: true,
        // expose effect so computed can be stopped
        effect: runner,
        get value() {
            if (dirty) {
                value = runner();
                dirty = false;
            }
            // When computed effects are accessed in a parent effect, the parent
            // should track all the dependencies the computed property has tracked.
            // This should also apply for chained computed properties.
            trackChildRun(runner);
            return value;
        },
        set value(newValue) {
            setter(newValue);
        }
    };
}
function trackChildRun(childRunner) {
    if (activeEffect === undefined) {
        return;
    }
    for (let i = 0; i < childRunner.deps.length; i++) {
        const dep = childRunner.deps[i];
        if (!dep.has(activeEffect)) {
            dep.add(activeEffect);
            activeEffect.deps.push(dep);
        }
    }
}

export { ITERATE_KEY, computed, effect, isReactive, isReadonly, isRef, lock, markNonReactive, markReadonly, pauseTracking, reactive, readonly, ref, resumeTracking, shallowReadonly, stop, toRaw, toRefs, unlock };
