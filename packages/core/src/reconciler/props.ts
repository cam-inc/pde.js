import { options } from '../options';
import { hasOwnProperty, isReadOnlyHtmlAttribute } from '../helpers';
import { PDJSX, VNode } from '../types';
// import type { UnionToIntersection } from "type-fest";
// import { isObjectFactory } from "./helpers";

type ReconcilePropsParams = {
  dom: PDJSX.Element;
  newProps: VNode['props'];
  oldProps: VNode['props'] | { [key: string]: any };
};

type SetStylePropsParams = {
  dom: PDJSX.Element;
  key: string;
  value: string | number | null;
};

type SetPropsParams = {
  dom: PDJSX.Element;
  key: string;
  newValue: { [key: string]: any } | null;
  oldValue: string | { [key: string]: any };
};

export const setStyleProps = ({ dom, key, value }: SetStylePropsParams) => {
  if (key.startsWith('-') && typeof value !== 'number') {
    dom.style.setProperty(key, value);
  } else if (value == null) {
    // @ts-expect-error Set readonly style
    dom.style[key] = '';
  } else if (typeof value !== 'number') {
    // @ts-expect-error Set readonly style
    dom.style[key] = value;
  } else {
    // @ts-expect-error Set readonly style
    dom.style[key] = `${value}px`;
  }
};

export const setProps = ({ dom, key, newValue, oldValue }: SetPropsParams) => {
  if (key === 'style') {
    if (typeof newValue === 'string') {
      dom.style.cssText = newValue;
    } else {
      if (typeof oldValue === 'string') {
        // NOTE: Remove the old css text for setting style by key & value
        oldValue = '';
        dom.style.cssText = oldValue;
      }

      if (oldValue) {
        for (const oldKey in oldValue as {}) {
          if (!(newValue && hasOwnProperty(newValue, oldKey))) {
            setStyleProps({
              dom,
              key: oldKey,
              value: '',
            });
          }
        }
      }

      if (newValue) {
        for (const newKey in newValue) {
          if (
            !oldValue ||
            newValue[newKey] !== (oldValue as { [key: string]: any })[newKey]
          ) {
            setStyleProps({
              dom,
              key: newKey,
              value: newValue[newKey],
            });
          }
        }
      }
    }
  } else if (key.startsWith('on')) {
    const useCapture = key !== (key = key.replace(/Capture$/, ''));
    const lowerKey = key.toLowerCase();
    // NOTE: `in` is better than `hasOwnProperty` when we want to check
    // the existence of the DOM premitive events.
    const eventType = (lowerKey in dom ? lowerKey : key).slice(2);
    if (!dom._listeners) {
      dom._listeners = {};
    }
    // @ts-expect-error newValue is event listener
    dom._listeners[eventType + useCapture] = newValue;
    if (newValue) {
      if (!oldValue) {
        const handler = useCapture ? eventProxyCapture : eventProxy;
        dom.addEventListener(eventType, handler, useCapture);
      }
    } else {
      const handler = useCapture ? eventProxyCapture : eventProxy;
      dom.removeEventListener(eventType, handler);
    }
  } else if (isReadOnlyHtmlAttribute(key, dom)) {
    // @ts-expect-error Set readonly props
    dom[key] = newValue ?? '';
  } else if (
    typeof newValue === 'string' &&
    key !== 'dangerouslySetInnerHTML'
  ) {
    dom.setAttribute(key, newValue);
  } else if (key === 'contentEditable') {
    dom.setAttribute('contenteditable', newValue as unknown as string);
  } else {
    // @ts-expect-error
    dom._pluginProps[key] = newValue;
  }
};

export const reconcileProps = ({
  dom,
  newProps,
  oldProps,
}: ReconcilePropsParams) => {
  for (const [oldKey, oldValue] of Object.entries(oldProps)) {
    if (
      oldKey !== 'children' &&
      oldKey !== 'key' &&
      !hasOwnProperty(newProps, oldKey)
    ) {
      setProps({
        dom,
        key: oldKey,
        newValue: null,
        oldValue,
      });
    }
  }

  for (const [newKey, newValue] of Object.entries(newProps)) {
    if (
      newKey !== 'children' &&
      newKey !== 'key' &&
      newKey !== 'value' &&
      newKey !== 'checked' &&
      oldProps[newKey] !== newValue
    ) {
      setProps({
        dom,
        key: newKey,
        newValue,
        oldValue: oldProps[newKey],
      });
    }
  }
};

/**
 * Proxy an event to hooked event handlers
 * sourced: https://github.com/preactjs/preact/blob/17da4efa736f14c84cd9f36fca4420d94f0dd403/src/diff/props.js#L147-L158
 * NOTE: We added `@ts-expect-error` without any comments because checked the smoketest of trying the source.
 */
function eventProxy(e: Event) {
  // @ts-expect-error
  this._listeners[e.type + false](options.event ? options.event(e) : e);
}

function eventProxyCapture(e: Event) {
  // @ts-expect-error
  this._listeners[e.type + true](options.event ? options.event(e) : e);
}

// TODO: JSX as props
// const transformPluginProps = (
//   pluginProps: NonNullable<VNode["pluginProps"]>
// ): NonNullable<VNode["pluginProps"]> => {
//   for (const [k, v] of Object.entries(pluginProps)) {
//     // NOTE: Check poperty object
//     const { isObject, isEmptyObject } = isObjectFactory(v);
//     if (isObject && !isEmptyObject) {
//       if (hasOwnProperty(v, "type")) {
//         const nodes = traverseNodes(v);
//         if (nodes !== null) {
//           // NOTE: This nodes doesn't have Editor.js native JSX Element, so add `isRoot: true` manually
//           nodes.isRoot = true;
//           const domTree = createDomTree(nodes);
//           // @ts-expect-error
//           pluginProps[k] = domTree;
//         }
//       } else {
//         return transformPluginProps(v);
//       }
//     }
//   }
//   return pluginProps;
// };
