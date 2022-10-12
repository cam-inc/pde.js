/**
 * The implementation included in this file is based on Preact.
 * Variables, functions, modules, etc. are renamed to names that are easier for us to interpret.
 *
 * Here is the file referenced and the original license.
 *
 * --- REFERENCED FILE ---
 *
 * https://github.com/preactjs/preact/blob/17da4efa736f14c84cd9f36fca4420d94f0dd403/src/create-element.js
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

import { VNodeProps, VNode, Props } from './types';

let vNodeId = 0;

export const createVNode = ({
  type,
  props,
  key,
  ref,
  original,
}: VNodeProps) => {
  const vNode: VNode = {
    type,
    props,
    key,
    ref,
    children: null,
    parent: null,
    depth: 0,
    dom: null,
    nextDom: null,
    component: null,
    hydrating: null,
    // @ts-expect-error
    constructor: undefined,
    original: original == null ? vNodeId++ : original,
    pluginProps: null,
    isRoot: false,
  };

  return vNode;
};

export const createElement = (
  type: VNode['type'],
  config: { [key: string]: any } | null,
  /*
   * NOTE: We replaced original implementations using `arguments`
   * with using rest parameters(`...`).
   */
  ...children: VNode[]
) => {
  const props: { [key: string]: any } = {};

  let key: VNodeProps['key'] = null;
  let ref: VNodeProps['ref'] = null;
  for (let i in config) {
    if (i === 'key') {
      key = config[i];
    } else if (i === 'ref') {
      ref = config[i];
    } else {
      props[i] = config[i];
    }
  }

  if (children != null) {
    props.children = children;
  }

  return createVNode({
    type,
    props: props as unknown as Props,
    key,
    ref,
    original: null,
  });
};

export const Fragment = (props: VNode['props']) => props.children;
