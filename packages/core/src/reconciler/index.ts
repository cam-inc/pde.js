/**
 * The implementation included in this file is based on Preact.
 * Variables, functions, modules, etc. are renamed to names that are easier for us to interpret.
 *
 * Here is the file referenced and the original license.
 *
 * --- REFERENCED FILE ---
 *
 * https://github.com/preactjs/preact/blob/17da4efa736f14c84cd9f36fca4420d94f0dd403/src/diff/index.js
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

import {
  PDJSX,
  VNode,
  Component as ComponentType,
  FunctionComponent,
} from '../types';
import { hasOwnProperty, isEditorJSVNode, removeNode } from '../helpers';
import { reconcileElements } from './elements';
import { reconcileChildren } from './childlen';
import { Fragment } from '../create-element';
import { Component } from '../component';
import { options } from '../options';

type ReconcileParams = {
  parentDom: PDJSX.Element;
  oldDom: PDJSX.Element | null;
  newVNode: VNode;
  oldVNode: VNode | null;
  commitQueue: ComponentType[];
  isSvg: boolean;
};

type RenderParams = {
  props: VNode['props'];
  state: ComponentType['state'];
  context: ComponentType['globalContext'];
};

export interface IComponent extends ComponentType {
  render?: (
    renderFunc: VNode['type'],
    params: RenderParams
  ) => VNode['children'];
  props?: VNode['props'];
}

const renderProxy: NonNullable<IComponent['render']> = function (
  type,
  { props, state, context }
) {
  // @ts-expect-error As functional component.
  return type(props, context);
};

export const reconcile = ({
  parentDom,
  oldDom,
  newVNode,
  oldVNode,
  commitQueue,
  isSvg,
}: ReconcileParams) => {
  // NOTE: This mutable variable will include a lot of side effects.
  // So, we named it with `dirty` prefix.
  let dirtyComponent = {} as IComponent;
  const newType = newVNode.type;

  if (newVNode.pluginName) {
    options.pluginName = newVNode.pluginName;
  }

  if (options.diff) {
    options.diff(newVNode);
  }

  if (typeof newType === 'function') {
    const newProps = newVNode.props;

    if (oldVNode?.component) {
      newVNode.component = oldVNode.component;
      dirtyComponent = newVNode.component;
    } else {
      if (
        hasOwnProperty(newType, 'prototype' as keyof FunctionComponent) &&
        hasOwnProperty(newType.prototype, 'render')
      ) {
        // @ts-expect-error The newType is a class component
        dirtyComponent = new newType(newProps);
        newVNode.component = dirtyComponent;
      } else {
        // NOTE: Component transform function into class.
        dirtyComponent = new Component(newProps, {}) as unknown as IComponent;
        newVNode.component = dirtyComponent;

        dirtyComponent.render = renderProxy;
      }

      dirtyComponent.props = newProps;
      if (!dirtyComponent.state) {
        dirtyComponent.state = {};
      }
      dirtyComponent.dirty = true;
      dirtyComponent.renderCallbacks = [];
    }

    // TODO: life cycle methods
    if (dirtyComponent.nextState == null) {
      dirtyComponent.nextState = dirtyComponent.state;
    }

    dirtyComponent.props = newProps;
    dirtyComponent.state = dirtyComponent.nextState;

    dirtyComponent.dirty = false;
    dirtyComponent.vNode = newVNode;
    dirtyComponent.parentDom = parentDom;

    if (options.render) {
      options.render(newVNode);
    }

    const rendered = (
      dirtyComponent.render
        ? dirtyComponent.render(newType, {
            props: dirtyComponent.props,
            state: dirtyComponent.state,
            context: dirtyComponent.globalContext,
          })
        : null
    ) as VNode | null;

    dirtyComponent.state = dirtyComponent.nextState;

    const isRootFragment =
      rendered != null && rendered.type === Fragment && rendered.key == null;
    const renderResult =
      isRootFragment ||
      (typeof newType === 'string' && isEditorJSVNode(newType))
        ? rendered?.props.children
        : rendered;

    reconcileChildren({
      parentDom,
      renderResult: Array.isArray(renderResult) ? renderResult : [renderResult],
      newParentVNode: newVNode,
      oldParentVNode: oldVNode,
      commitQueue,
      oldDom,
      isSvg,
    });

    if (dirtyComponent.renderCallbacks.length) {
      commitQueue.push(dirtyComponent);
    }
  } else {
    newVNode.dom = reconcileElements({
      dom: oldVNode?.dom ?? null,
      newVNode,
      oldVNode,
      commitQueue,
      isSvg,
    }) as PDJSX.Element;

    if (options.diffed) {
      options.diffed(newVNode);
    }
  }

  return newVNode.dom;
};

export const commitRoot = (commitQueue: ComponentType[], root?: VNode) => {
  if (options.commit && root) {
    options.commit(root, commitQueue);
  }
  commitQueue.some((component) => {
    commitQueue = component.renderCallbacks;
    component.renderCallbacks = [];
    commitQueue.some((cb) => {
      // @ts-expect-error The cb is callable.
      cb.call(component);
    });
  });
};

export const unmount = (
  vNode: VNode,
  parentVNode: VNode,
  skipRemove: boolean
) => {
  let dirtyComponent: VNode['component'];
  let dom: PDJSX.Element | null = null;

  if (options.commit) {
    options.commit(vNode, []);
  }

  if (!skipRemove && typeof vNode.type !== 'function') {
    dom = vNode.dom;
    skipRemove = dom != null;
  }

  vNode.nextDom = null;
  vNode.dom = vNode.nextDom;

  dirtyComponent = vNode.component;
  if (dirtyComponent != null) {
    dirtyComponent.parentDom = null;
    dirtyComponent.base = null;
  }

  dirtyComponent = vNode.children as unknown as ComponentType;
  if (dirtyComponent && Array.isArray(dirtyComponent)) {
    dirtyComponent.forEach((d) => {
      unmount(d, parentVNode, skipRemove);
    });
  }

  if (dom != null) {
    removeNode(dom);
  }
};
