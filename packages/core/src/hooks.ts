/**
 * The implementation included in this file is based on Preact.
 * Variables, functions, modules, etc. are renamed to names that are easier for us to interpret.
 *
 * Here is the file referenced and the original license.
 *
 * --- REFERENCED FILE ---
 *
 * https://github.com/preactjs/preact/blob/17da4efa736f14c84cd9f36fca4420d94f0dd403/hooks/src/index.js
 *
 * --- ---
 *
 * --- ORIGINAL LICENSE ---
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-present Jason Miller
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * --- ---
 */

import { Component as ComponentType } from './types';
import { options } from './options';

type Effect = () => void | Cleanup;
type Cleanup = () => void;
export type StateUpdater<S = any> = (value: S | ((prevState: S) => S)) => void;
export type Reducer<S = any, A = any> = (prevState: S, action: A) => S;

type EffectHookState = {
  value?: Effect | unknown[] | null;
  args?: unknown[];
  pendingArgs?: unknown[] | null;
  cleanup?: Cleanup | null;
};
type ReducerHookState = {
  nextValue?: Cleanup | unknown[] | null;
  reducer?: Reducer;
  component?: ComponentType;
};
type MemoHookState = {
  pendingValue?: unknown[];
};
type HookState = EffectHookState & ReducerHookState & MemoHookState;

interface Component extends ComponentType {
  hooks?: {
    list: HookState[];
    pendingEffects: EffectHookState[];
  };
}

let currentIndex: number;
let currentComponent: Component | null = null;
let previousComponent: Component | null;
let currentHook = 0;
let afterPaintEffects: Component[] = [];
let prevRaf: Window['requestAnimationFrame'] | undefined;

let HAS_RAF = typeof requestAnimationFrame === 'function';
const RAF_TIMEOUT = 100;

const oldBeforeDiff = options.diff;
const oldBeforeRender = options.render;
const oldAfterDiff = options.diffed;
const oldCommit = options.commit;
const oldBeforeUnmount = options.unmount;

const invokeCleanup = (hook: EffectHookState) => {
  // NOTE: currentComponent will be changed by calling hook.cleanup
  const _currentComponent = currentComponent;
  const _cleanup = hook.cleanup;
  if (typeof _cleanup === 'function') {
    hook.cleanup = null;
    _cleanup();
  }

  currentComponent = _currentComponent;
};
const invokeEffect = (hook: EffectHookState) => {
  const _currentComponent = currentComponent;
  if (typeof hook.value === 'function') {
    hook.cleanup = hook.value() as () => void;
  }
  currentComponent = _currentComponent;
};

const flushAfterPaintEffects = () => {
  let component: Component | undefined;
  while ((component = afterPaintEffects.shift())) {
    if (!component.parentDom) {
      continue;
    }
    if (component.hooks) {
      component.hooks.pendingEffects.forEach(invokeCleanup);
      component.hooks.pendingEffects.forEach(invokeEffect);
      component.hooks.pendingEffects = [];
    }
  }
};
const afterNextFrame = (callback: () => void) => {
  const done = () => {
    clearTimeout(timeout);
    if (HAS_RAF) {
      cancelAnimationFrame(rafId);
      setTimeout(callback);
    }
  };
  const timeout = setTimeout(done, RAF_TIMEOUT);

  let rafId: number;
  if (HAS_RAF) {
    rafId = requestAnimationFrame(done);
  }
};
const afterPaint = (newQueueLength: number) => {
  if (newQueueLength === 1 || prevRaf !== options.requestAnimationFrame) {
    prevRaf = options.requestAnimationFrame;
    (prevRaf || afterNextFrame)(flushAfterPaintEffects);
  }
};

const argsChanged = (oldArgs: any[] | undefined, newArgs: any[]) => {
  return (
    !oldArgs ||
    oldArgs.length !== newArgs.length ||
    newArgs.some((arg, index) => arg !== oldArgs[index])
  );
};

const invokeOrReturn = (param: any, f: any) => {
  return typeof f === 'function' ? f(param) : f;
};

const getHookState = (index: number, type: number) => {
  if (currentComponent !== null) {
    if (options.hook) {
      options.hook(currentComponent, index, currentHook || type);
    }
    currentHook = 0;

    const hooks =
      currentComponent.hooks ||
      (currentComponent.hooks = {
        list: [],
        pendingEffects: [],
      });

    if (index >= hooks.list.length) {
      hooks.list.push({ pendingValue: [] });
    }
    return hooks.list[index];
  }
};

const getSiblingPluginName = (): string | undefined => {
  if (currentComponent !== null && currentComponent.parentDom?.children) {
    // @ts-expect-error The children is VNode.
    return currentComponent.parentDom.children.pluginName;
  }
};

options.diff = (vNode) => {
  currentComponent = null;
  if (oldBeforeDiff) {
    oldBeforeDiff(vNode);
  }
};

options.render = (vNode) => {
  if (oldBeforeRender) {
    oldBeforeRender(vNode);
  }

  if (vNode.component && vNode.pluginName) {
    vNode.component.pluginName = vNode.pluginName;
    options.pluginName = vNode.component.pluginName;
  }

  currentComponent = vNode.component;
  currentIndex = 0;

  const siblingPluginName = getSiblingPluginName();
  // NOTE: siblingPluginName has value after batching state updater.
  options.pluginName = siblingPluginName ?? null;

  const hooks = currentComponent?.hooks ?? null;
  if (hooks !== null) {
    if (previousComponent === currentComponent) {
      hooks.pendingEffects = [];
      if (currentComponent !== null) {
        currentComponent.renderCallbacks = [];
      }
      hooks.list.forEach((hook) => {
        if (hook.nextValue) {
          hook.value = hook.nextValue;
        }
        hook.pendingValue = [];
        hook.pendingArgs = null;
        hook.nextValue = hook.pendingArgs;
      });
    } else {
      hooks.pendingEffects.forEach(invokeCleanup);
      hooks.pendingEffects.forEach(invokeEffect);
      hooks.pendingEffects = [];
    }
  }
  previousComponent = currentComponent;
};

options.diffed = (vNode) => {
  if (oldAfterDiff) {
    oldAfterDiff(vNode);
  }

  const component = vNode.component as Component;
  if (component && component.hooks) {
    if (component.hooks.pendingEffects.length) {
      afterPaint(afterPaintEffects.push(component));
    }
    component.hooks.list.forEach((hook) => {
      if (hook.pendingArgs) {
        hook.args = hook.pendingArgs;
      }
      if (hook.pendingValue !== undefined && hook.pendingValue.length > 0) {
        hook.value = hook.pendingValue;
      }
      hook.pendingArgs = null;
      hook.pendingValue = [];
    });
  }
  currentComponent = null;
  previousComponent = currentComponent;
};

options.commit = (vNode, commitQueue) => {
  commitQueue.some((component) => {
    // @ts-expect-error
    component.renderCallbacks.forEach(invokeCleanup);
    component.renderCallbacks = component.renderCallbacks.filter((cb) => {
      // @ts-expect-error
      return cb.value ? invokeEffect(cb) : true;
    });
  });

  if (oldCommit) {
    oldCommit(vNode, commitQueue);
  }
};

options.unmount = (vNode) => {
  if (oldBeforeUnmount) {
    oldBeforeUnmount(vNode);
  }

  const component = vNode.component as Component;
  if (component && component.hooks) {
    component.hooks.list.forEach((hook) => {
      invokeCleanup(hook);
    });
  }
};

export const useReducer = <S>(
  reducer: Reducer,
  initialState: S | StateUpdater<S>,
  initilizer?: (state: any) => void
) => {
  const hookState = getHookState(currentIndex++, 2);
  if (hookState != null) {
    hookState.reducer = reducer;
    if (!hookState.component) {
      hookState.value = [
        initilizer == null
          ? invokeOrReturn(undefined, initialState)
          : initilizer(initialState),
        (action: S | StateUpdater<S>) => {
          if (hookState.reducer && hookState.component) {
            const currentValue = Array.isArray(hookState.nextValue)
              ? hookState.nextValue[0]
              : Array.isArray(hookState.value)
              ? hookState.value[0]
              : null;
            const nextValue = hookState.reducer(currentValue, action);

            if (currentValue !== nextValue && Array.isArray(hookState.value)) {
              hookState.nextValue = [nextValue, hookState.value[1]];
              hookState.component.setState({} as any);
            }
          }
        },
      ];

      hookState.component =
        currentComponent !== null ? currentComponent : undefined;

      if (hookState.component) {
        hookState.component.shouldComponentUpdate = () => {
          if (!hookState.nextValue) {
            return true;
          }

          const currentValue = Array.isArray(hookState.value)
            ? hookState.value[0]
            : undefined;
          hookState.value = hookState.nextValue;
          hookState.nextValue = undefined;

          return (
            currentValue !==
            (Array.isArray(hookState.value) ? hookState.value[0] : undefined)
          );
        };
      }
    }
  }

  return hookState?.nextValue || hookState?.value;
};

export const useState = <S = undefined>(initialState: S) => {
  currentHook = 1;
  return useReducer<S>(invokeOrReturn, initialState) as [S, StateUpdater<S>];
};

export const useWatch = (callback: Effect, args: any[]) => {
  const state = getHookState(currentIndex++, 3);

  if (!options.skipEffects && state && argsChanged(state.args, args)) {
    if (args.length > 0) {
      state.value = callback;
      state.pendingArgs = args;

      currentComponent?.renderCallbacks.push(state as Component);
    } else {
      throw new Error(
        'args should be array with at least one element. Use `useMount` instead.'
      );
    }
  }
};

export const useMount = (callback: Effect) => {
  const state = getHookState(currentIndex++, 4);
  let called = !!state?.value;

  if (state && !called) {
    state.value = callback;
    state.pendingArgs = [];

    currentComponent?.renderCallbacks.push(state as Component);
    currentComponent?.forceUpdate();

    called = true;
  }
};

export const useConstruct = <P = any>() => {
  return options.constructorParams as P | undefined;
};
