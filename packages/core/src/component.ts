/**
 * The implementation included in this file is based on Preact.
 * Variables, functions, modules, etc. are renamed to names that are easier for us to interpret.
 *
 * Here is the file referenced and the original license.
 *
 * --- REFERENCED FILE ---
 *
 * https://github.com/preactjs/preact/blob/17da4efa736f14c84cd9f36fca4420d94f0dd403/src/component.js
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

import { PDJSX, VNode, Component as ComponentType } from './types';
import { Fragment } from './create-element';
import { assign } from './helpers';
import { options } from './options';
import { commitRoot, reconcile } from './reconciler';

type SetStateUpdate = Parameters<PDJSX.Component['setState']>[0];
type SetStateCallback = Parameters<PDJSX.Component['setState']>[1];

export class Component implements PDJSX.Component {
  public props: VNode['props'];
  public context: ComponentType['globalContext'];

  public nextState: ComponentType['state'] | null = null;
  public state: ComponentType['state'] | null = null;
  public vNode: VNode | null = null;
  public renderCallbacks: ComponentType['renderCallbacks'] = [];
  public dirty: boolean = false;
  public pluginName: string | null = null;
  public force: boolean = false;

  constructor(props: VNode['props'], context: ComponentType['globalContext']) {
    this.props = props;
    this.context = context;
  }

  public setState(update: SetStateUpdate, callback: SetStateCallback) {
    let state: ComponentType['state'];

    if (this.nextState != null && this.nextState !== this.state) {
      state = this.nextState;
    } else {
      this.nextState = assign({}, this.state ?? {});
      state = this.nextState;
    }

    if (typeof update === 'function') {
      update = update(assign({}, state), this.props) as SetStateUpdate;
    }

    if (update != null) {
      assign(state, update);
    }

    if (update == null) {
      return;
    }

    if (this.vNode) {
      if (callback) {
        this.renderCallbacks.push(callback as unknown as ComponentType);
      }
      enqueueRender(this as unknown as ComponentType);
    }
  }

  public forceUpdate(callback: SetStateCallback) {
    if (this.vNode) {
      this.force = true;
      if (callback) {
        this.renderCallbacks.push(callback as unknown as ComponentType);
      }
      enqueueRender(this as unknown as ComponentType);
    }
  }

  public render(props: VNode['props']) {
    return Fragment(props);
  }
}

let renderQueue: ComponentType[] = [];
let prevDebounce: typeof options['debounceRendering'];

const renderComponent = (component: ComponentType) => {
  const vNode = component.vNode;
  const oldDom = vNode?.dom ?? null;
  const parentDom = component.parentDom;

  if (parentDom && vNode && typeof vNode.original === 'number') {
    let commitQueue: ComponentType[] = [];
    const oldVNode = assign({}, vNode) as VNode;
    oldVNode.original = vNode.original + 1;

    const newDom = reconcile({
      parentDom,
      newVNode: vNode,
      oldVNode,
      commitQueue,
      oldDom,
      isSvg: parentDom.ownerSVGElement !== undefined,
    });
    commitRoot(commitQueue, vNode);

    if (options.pluginName !== null) {
      const target = document.getElementById(options.pluginName);
      if (target && newDom) {
        target.appendChild(newDom);
      }
    }

    if (newDom != oldDom) {
      updateParentDomPointers(vNode);
    }
  }
};
const updateParentDomPointers = (vNode: VNode): Function | undefined => {
  if (vNode.parent != null) {
    vNode = vNode.parent;
  }
  if (vNode.component != null) {
    vNode.component.base = null;
    vNode.dom = vNode.component.base;
    for (let i = 0; vNode.children && i < vNode.children.length; i++) {
      const child = vNode.children[i];
      if (child != null && child.dom != null) {
        vNode.component.base = child.dom;
        vNode.dom = vNode.component.base;
        break;
      }
    }
    return updateParentDomPointers(vNode);
  }
};
const enqueueRender = (component: ComponentType) => {
  if (
    (!component.dirty &&
      (component.dirty = true) &&
      renderQueue.push(component) &&
      !process.rerenderCount++) ||
    prevDebounce !== options.debounceRendering
  ) {
    prevDebounce = options.debounceRendering;
    (prevDebounce || setTimeout)(process);
  }
};
const process = () => {
  let queue;

  while ((process.rerenderCount = renderQueue.length)) {
    queue = renderQueue.sort((a, b) => {
      if (a.vNode && b.vNode) {
        return a.vNode.depth - b.vNode.depth;
      } else {
        return 0;
      }
    });
    renderQueue = [];
    queue.some((component) => {
      if (component.dirty) {
        renderComponent(component);
      }
    });
  }
};
process.rerenderCount = 0;
