/// <reference types="react" />
import { ReactiveEffect } from '@vue/reactivity';
export declare const useForceUpdate: () => import("react").DispatchWithoutAction;
export declare const useEffection: (fn: () => unknown, options?: import("@vue/reactivity").ReactiveEffectOptions | undefined) => ReactiveEffect<any>;
