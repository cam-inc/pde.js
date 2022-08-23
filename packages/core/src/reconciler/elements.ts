import { isEditorJSVNode } from '../helpers';
import { Component as ComponentType, PDJSX, VNode } from '../types';
import { reconcileChildren } from './childlen';
import { reconcileProps } from './props';

export type ReconcileElementsParams = {
  dom: PDJSX.Element | null;
  newVNode: VNode;
  oldVNode: VNode | null;
  commitQueue: ComponentType[];
};

export const reconcileElements = ({
  dom,
  newVNode,
  oldVNode,
  commitQueue,
}: ReconcileElementsParams) => {
  const newProps = newVNode.props;
  const oldProps = oldVNode?.props ?? {};

  if (dom === null) {
    // NOTE: Not element but text node value
    if (newVNode.type === null) {
      return document.createTextNode(`${newProps}`);
    }

    if (isEditorJSVNode(newVNode.type as string)) {
      dom = document.createDocumentFragment() as unknown as HTMLElement;
      const { children, ...pluginProps } = newProps;
      dom._pluginProps = pluginProps as VNode['pluginProps'];
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
    });

    const children = newVNode.props.children;
    reconcileChildren({
      parentDom: dom,
      renderResult: Array.isArray(children) ? children : [children],
      newParentVNode: newVNode,
      oldParentVNode: oldVNode,
      commitQueue,
      oldDom: null,
    });
  }
  return dom;
};
