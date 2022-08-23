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
