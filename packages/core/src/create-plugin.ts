import type { ToolConstructable } from '@editorjs/editorjs';
import { createElement, Fragment } from './create-element';
import { Component as ComponentType, PDJSX, VNode } from './types';
import { commitRoot, reconcile } from './reconciler';
import { createPluginClass } from './helpers';

// NOTE: Removed `replaceNode` from params because of using this directory as API
export const createPlugin = (
  vNode: VNode | Substitutional.Element
): ToolConstructable => {
  // NOTE: An array for collecting side effects.
  let commitQueue: ComponentType[] = [];

  // TODO: JSX as props
  // transformPluginProps(nodes?.pluginProps);

  const render = function () {
    const id = `${Date.now()}`;

    const initialVNode = createElement(Fragment, null, vNode as VNode);
    const parentDom = { children: initialVNode } as unknown as PDJSX.Element;

    initialVNode.pluginName = id;

    // NOTE: It is need to create DOM in this render function.
    // So, we call the reconcle function in this.
    // This is referred in https://editorjs.io/tools-api#render that
    // the render function should call document.createElement and return the result of it.
    const dom = reconcile({
      parentDom,
      newVNode: initialVNode,
      oldVNode: null,
      commitQueue,
      oldDom: null,
    });

    if (dom) {
      const wrapper = document.createElement('x-pd');
      wrapper.id = id;
      wrapper.appendChild(dom);
      return wrapper;
    } else {
      throw new Error('The new dom is empty.');
    }
  };

  // NOTE: The _initialVNode and _parentDom are created for get pluginProps.
  // So, we won't use those for the reconciliation.
  const _initialVNode = createElement(Fragment, null, vNode as VNode);
  const _parentDom = { children: _initialVNode } as unknown as PDJSX.Element;
  const PluginDeclarative = createPluginClass(
    reconcile({
      parentDom: _parentDom,
      newVNode: _initialVNode,
      oldVNode: null,
      commitQueue: [],
      oldDom: null,
    })?._pluginProps ?? null
  );

  PluginDeclarative.prototype.render = render;

  commitRoot(commitQueue);

  return PluginDeclarative as unknown as ToolConstructable;
};
