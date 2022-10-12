/**
 * The implementation included in this file is based on Preact.
 * Variables, functions, modules, etc. are renamed to names that are easier for us to interpret.
 *
 * Here is the file referenced and the original license.
 *
 * --- REFERENCED FILE ---
 *
 * https://github.com/preactjs/preact/blob/17da4efa736f14c84cd9f36fca4420d94f0dd403/src/diff/children.js
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

import { createVNode, Fragment } from '../create-element';
import { reconcile, unmount } from '.';
import {
  PDJSX,
  ComponentChild,
  VNode,
  Component as ComponentType,
} from '../types';

export type ReconcileChildrenParams = {
  parentDom: PDJSX.Element;
  renderResult: (ComponentChild[] | ComponentChild)[];
  newParentVNode: VNode;
  oldParentVNode: VNode | null;
  commitQueue: ComponentType[];
  oldDom: PDJSX.Element | null;
  isSvg: boolean;
};

export type PlaceChildParams = {
  parentDom: PDJSX.Element;
  childVNode: VNode;
  oldVNode: VNode;
  oldChildren: (VNode | null)[];
  newDom: PDJSX.Element | null;
  oldDom: PDJSX.Element | null;
};

export const getDomSibling = (
  vNode: VNode | null,
  childIndex: number | null
): PDJSX.Element | null => {
  if (childIndex === null) {
    return vNode?.parent
      ? getDomSibling(
          vNode.parent,
          vNode.parent.children
            ? vNode.parent.children.indexOf(vNode) + 1
            : null
        )
      : null;
  }

  let sibling: VNode | null = null;
  if (vNode?.children != null) {
    for (; childIndex < vNode.children.length; childIndex++) {
      sibling = vNode.children[childIndex];

      if (sibling != null && sibling.dom != null) {
        return sibling.dom;
      }
    }
  }

  return typeof vNode?.type === 'function' ? getDomSibling(vNode, null) : null;
};

export const placeChild = ({
  parentDom,
  childVNode,
  oldVNode,
  oldChildren,
  newDom,
  oldDom,
}: PlaceChildParams) => {
  let nextDom: PDJSX.Element | null = null;

  if (childVNode.nextDom != null) {
    nextDom = childVNode.nextDom;
    childVNode.nextDom = null;
  } else if (
    (oldVNode == null || newDom !== oldDom || newDom?.parentNode == null) &&
    'appendChild' in parentDom
  ) {
    outer: if (
      newDom != null &&
      (oldDom == null || oldDom.parentNode !== parentDom)
    ) {
      parentDom.appendChild(newDom);
      nextDom = null;
    } else {
      // NOTE: `i < oldChildrenLength; i += 2` is an alternative to `i++ < oldChildrenLength/2`
      // Sourced from https://github.com/preactjs/preact/blob/8440c10c0f5836fa1ca162b29010d7a710b6ceef/src/diff/children.js#L310
      for (
        let sibDom = oldDom, i = 0;
        (sibDom = (sibDom?.nextSibling ?? null) as PDJSX.Element | null) &&
        i < oldChildren.length;
        i += 2
      ) {
        if (sibDom === newDom) {
          break outer;
        }
      }

      if (newDom != null && oldDom != null) {
        parentDom.insertBefore(newDom, oldDom);
      }
      nextDom = oldDom;
    }
  }

  if (nextDom != null) {
    oldDom = nextDom;
  } else {
    oldDom = (newDom?.nextSibling ?? null) as PDJSX.Element | null;
  }

  return oldDom;
};

export const reconcileChildren = ({
  parentDom,
  renderResult,
  newParentVNode,
  oldParentVNode,
  commitQueue,
  oldDom,
  isSvg,
}: ReconcileChildrenParams) => {
  let oldVNode: VNode | null;
  let childVNode: VNode | ComponentChild | ComponentChild[];

  let firstChildDom: PDJSX.Element | null = null;
  let filteredOldDom: PDJSX.Element | Text | null = null;

  const oldChildren = oldParentVNode ? oldParentVNode.children : [];
  const oldChildrenLength = oldChildren?.length ?? 0;

  if (oldDom == null) {
    if (oldChildrenLength) {
      filteredOldDom = getDomSibling(oldParentVNode, 0);
    } else {
      filteredOldDom = null;
    }
  }

  newParentVNode.children = [];
  // NOTE: We use `for` statement for enabling to `break` or `continue` the loop.
  for (let i = 0; i < renderResult.length; i++) {
    childVNode = renderResult[i];

    if (childVNode == null || typeof childVNode === 'boolean') {
      newParentVNode.children[i] = null;
      childVNode = newParentVNode.children[i];
    } else if (
      typeof childVNode === 'string' ||
      typeof childVNode === 'number'
    ) {
      // NOTE: For premitive child.
      newParentVNode.children[i] = createVNode({
        type: null,
        props: childVNode as unknown as VNode['props'],
        key: null,
        ref: null,
        original: childVNode,
      });
      childVNode = newParentVNode.children[i];
    } else if (Array.isArray(childVNode)) {
      // NOTE: For array child.
      newParentVNode.children[i] = createVNode({
        type: Fragment,
        props: { children: childVNode },
        key: null,
        ref: null,
        original: null,
      });
      childVNode = newParentVNode.children[i];
    } else if (
      (childVNode as VNode).dom != null ||
      (childVNode as VNode).component != null
    ) {
      // NOTE: For PDJSX.Element child.
      newParentVNode.children[i] = createVNode({
        type: (childVNode as VNode).type,
        props: (childVNode as VNode).props,
        key: (childVNode as VNode).key,
        ref: null,
        original: (childVNode as VNode).original,
      });
      childVNode = newParentVNode.children[i];
    } else {
      // NOTE: For component child.
      newParentVNode.children[i] = childVNode as VNode | null;
      childVNode = newParentVNode.children[i];
    }

    if (childVNode == null) {
      continue;
    }

    childVNode.parent = newParentVNode;
    childVNode.depth = newParentVNode.depth + 1;

    oldVNode = oldChildren ? oldChildren[i] : null;

    if (oldChildren != null) {
      if (
        oldVNode === null ||
        (oldVNode &&
          childVNode.key === oldVNode.key &&
          childVNode.type === oldVNode.type)
      ) {
        oldChildren[i] = null;
      } else {
        for (let i = 0; i < oldChildrenLength; i++) {
          oldVNode = oldChildren[i];
          if (
            oldVNode &&
            childVNode.key === oldVNode.key &&
            childVNode.ref === childVNode.ref
          ) {
            oldChildren[i] = null;
            break;
          }
          oldVNode = null;
        }
      }
    }

    oldVNode = oldVNode || ({} as VNode);

    const newDom = reconcile({
      parentDom,
      newVNode: childVNode,
      oldVNode,
      commitQueue,
      oldDom: filteredOldDom,
      isSvg,
    });

    if (newDom != null) {
      if (firstChildDom == null) {
        firstChildDom = newDom;
      }

      filteredOldDom = placeChild({
        parentDom,
        childVNode,
        oldVNode,
        oldChildren: oldChildren ?? [],
        newDom,
        oldDom,
      });

      if (typeof newParentVNode.type === 'function') {
        newParentVNode.nextDom = filteredOldDom as VNode['nextDom'];
      }
    }
  }

  newParentVNode.dom = firstChildDom;

  for (let i = oldChildrenLength; i--; ) {
    if (oldChildren && oldChildren[i] != null) {
      unmount(oldChildren[i] as VNode, oldChildren[i] as VNode, false);
    }
  }
};
