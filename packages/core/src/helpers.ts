import { emptyVNode, pluginMethodPrefixes } from './constants';
import { PDJSX, PDJSXVNodeType, VNode } from './types';
import { paramCase } from 'change-case';
import { ToolConstructable } from '@editorjs/editorjs';

export const isWhiteSpace = (str: string) => str === ' ';

export const hasOwnProperty = <T = {}>(thisArg: T, key: keyof T) =>
  Object.prototype.hasOwnProperty.call(thisArg, key);

export const isEditorJSVNode = (
  type: PDJSXVNodeType | string
): type is PDJSXVNodeType => {
  return hasOwnProperty(emptyVNode, type as PDJSXVNodeType);
};

export const isObjectFactory = (o: unknown) => {
  const isObject =
    o != null &&
    typeof o === 'object' &&
    typeof o !== 'function' &&
    !Array.isArray(o);
  const isEmptyObject = isObject && Object.getOwnPropertyNames(o).length === 0;
  return {
    isObject,
    isEmptyObject,
  };
};

export const parseObjectToCssText = (o: { [key: string]: any }) => {
  let cssText = '';
  for (const [k, v] of Object.entries(o)) {
    cssText += `${paramCase(k)}: ${v};`;
  }
  return cssText;
};

export const isReadOnlyHtmlAttribute = (key: string, dom: PDJSX.Element) =>
  key !== 'list' &&
  key !== 'tagName' &&
  key !== 'form' &&
  key !== 'type' &&
  key !== 'size' &&
  key !== 'download' &&
  key !== 'href' &&
  hasOwnProperty(dom, key as keyof PDJSX.Element);

export const removeNode = (node: Node) => {
  const parentNode = node.parentNode;
  if (parentNode) {
    parentNode.removeChild(node);
  }
};

export const assign = (
  obj: { [key: string]: any },
  props: { [key: string]: any }
) => {
  for (const i in props) {
    obj[i] = props[i];
  }
  return obj;
};

export const createPluginClass = (pluginProps: VNode['pluginProps']) => {
  if (pluginProps) {
    const { STATIC_GETTER, STATIC_METHOD, CONSTRUCTOR } = pluginMethodPrefixes;

    class PluginDeclarative {
      constructor(params: any) {
        if (pluginProps?.initializer) {
          pluginProps.initializer(params);
        }
      }
    }

    for (const [k, v] of Object.entries(pluginProps)) {
      if (k.startsWith(STATIC_GETTER)) {
        const key = k.replace(STATIC_GETTER, '');
        PluginDeclarative[key as keyof typeof PluginDeclarative] = v;
      } else if (k.startsWith(STATIC_METHOD)) {
        const key = k.replace(STATIC_METHOD, '');
        PluginDeclarative[key as keyof typeof PluginDeclarative] = v;
      } else if (!k.startsWith(CONSTRUCTOR)) {
        // @ts-expect-error Class should have a property of the prototype.
        PluginDeclarative.prototype[k] = v;
      }
    }

    return PluginDeclarative as ToolConstructable;
  } else {
    return class {} as unknown as ToolConstructable;
  }
};
