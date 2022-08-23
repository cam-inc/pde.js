import { Component, VNode } from './types';

export type Options = {
  diff: (vNode: VNode) => void;
  diffed: (vNode: VNode) => void;
  render: (vNode: VNode) => void;
  unmount: (vNode: VNode) => void;

  commit: (vNode: VNode, commitQueue: Component[]) => void;
  hook: (component: Component, index: number, type: number) => void;
  requestAnimationFrame: typeof requestAnimationFrame;
  debounceRendering?: (cb: () => void) => void;
  skipEffects?: boolean;

  pluginName: string | null;
};

export const options = {} as Options;
