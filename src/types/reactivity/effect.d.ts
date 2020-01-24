import { TrackOpTypes, TriggerOpTypes } from './operations';
declare type Dep = Set<ReactiveEffect>;
export interface ReactiveEffect<T = any> {
    (): T;
    _isEffect: true;
    active: boolean;
    raw: () => T;
    deps: Array<Dep>;
    options: ReactiveEffectOptions;
}
export interface ReactiveEffectOptions {
    lazy?: boolean;
    computed?: boolean;
    scheduler?: (run: Function) => void;
    onTrack?: (event: DebuggerEvent) => void;
    onTrigger?: (event: DebuggerEvent) => void;
    onStop?: () => void;
}
export declare type DebuggerEvent = {
    effect: ReactiveEffect;
    target: object;
    type: TrackOpTypes | TriggerOpTypes;
    key: any;
} & DebuggerEventExtraInfo;
export interface DebuggerEventExtraInfo {
    newValue?: any;
    oldValue?: any;
    oldTarget?: Map<any, any> | Set<any>;
}
export declare let activeEffect: ReactiveEffect | undefined;
export declare const ITERATE_KEY: unique symbol;
export declare function isEffect(fn: any): fn is ReactiveEffect;
export declare function effect<T = any>(fn: () => T, options?: ReactiveEffectOptions): ReactiveEffect<T>;
export declare function stop(effect: ReactiveEffect): void;
export declare function pauseTracking(): void;
export declare function resumeTracking(): void;
export declare function track(target: object, type: TrackOpTypes, key: unknown): void;
export declare function trigger(target: object, type: TriggerOpTypes, key?: unknown, extraInfo?: DebuggerEventExtraInfo): void;
export {};
