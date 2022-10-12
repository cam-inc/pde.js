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

import { isEditorJSVNode } from '../helpers';
import { Component as ComponentType, PDJSX, VNode } from '../types';
import { reconcileChildren } from './childlen';
import { reconcileProps } from './props';

export type ReconcileElementsParams = {
  dom: PDJSX.Element | null;
  newVNode: VNode;
  oldVNode: VNode | null;
  commitQueue: ComponentType[];
  isSvg: boolean;
};

export const reconcileElements = ({
  dom,
  newVNode,
  oldVNode,
  commitQueue,
  isSvg,
}: ReconcileElementsParams) => {
  const nodeType = newVNode.type;
  const newProps = newVNode.props;
  const oldProps = oldVNode?.props ?? {};

  if (nodeType === 'svg') {
    isSvg = true;
  }

  if (dom === null) {
    // NOTE: Not element but text node value
    if (newVNode.type === null) {
      return document.createTextNode(`${newProps}`);
    }

    if (isEditorJSVNode(newVNode.type as string)) {
      dom = document.createDocumentFragment() as unknown as HTMLElement;
      const { children, ...pluginProps } = newProps;
      dom._pluginProps = pluginProps as VNode['pluginProps'];
    } else if (isSvg) {
      dom = document.createElementNS(
        'http://www.w3.org/2000/svg',
        nodeType as string
      ) as unknown as HTMLElement;
    } else {
      dom = document.createElement(newVNode.type as string);
    }
  }

  // NOTE: Apply side effects of props to the dom.
  if (newVNode.type === null) {
    const textNodeProps = newProps as unknown as PDJSX.Element['data'];
    if (newProps !== oldProps && dom.data !== textNodeProps) {
      dom.data = textNodeProps;
    }
  } else {
    reconcileProps({
      dom,
      newProps,
      oldProps,
      isSvg,
    });

    const children = newVNode.props.children;
    reconcileChildren({
      parentDom: dom,
      renderResult: Array.isArray(children) ? children : [children],
      newParentVNode: newVNode,
      oldParentVNode: oldVNode,
      commitQueue,
      oldDom: null,
      isSvg,
    });
  }
  return dom;
};
