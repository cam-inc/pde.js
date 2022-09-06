import { emptyVNode, pluginMethodPrefixes } from './constants';
import { PDJSX, PDJSXVNodeType, VNode } from './types';
import { paramCase } from 'change-case';
import { ToolConstructable } from '@editorjs/editorjs';

const { STATIC_GETTER, STATIC_METHOD, CONSTRUCTOR, UNSTABLE_METHODS } =
  pluginMethodPrefixes;

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

export const createPluginClass = (
  pluginProps: VNode['pluginProps'],
  render: () => HTMLElement
) => {
  if (pluginProps) {
    class PluginDeclarative {
      private params: any;

      public render: () => HTMLElement;

      constructor(params: any) {
        this.params = params;
        this.render = render;
      }
    }

    for (const [k, v] of Object.entries(pluginProps)) {
      if (k.startsWith(STATIC_GETTER)) {
        const key = k.replace(STATIC_GETTER, '');
        PluginDeclarative[key as keyof typeof PluginDeclarative] = v;
      } else if (k.startsWith(STATIC_METHOD)) {
        const key = k.replace(STATIC_METHOD, '');
        PluginDeclarative[key as keyof typeof PluginDeclarative] = v;
      } else if (k.startsWith(UNSTABLE_METHODS.RENDER_SETTINGS)) {
        PluginDeclarative.prototype[
          k as keyof typeof PluginDeclarative['prototype']
        ] = () => {
          const { wrapper, button, icons } = v as NonNullable<
            PDJSX.ToolAttributes['renderSettings']
          >;
          const wrapperElement = stringToHtmlElement(wrapper);
          icons.forEach((props) => {
            const buttonElement = stringToHtmlElement(button);
            if (buttonElement !== null) {
              buttonElement.innerHTML = props.icon;
              wrapperElement?.appendChild(buttonElement);
            }
          });
          return wrapperElement as HTMLElement;
        };
      } else if (!k.startsWith(CONSTRUCTOR)) {
        PluginDeclarative.prototype[
          k as keyof typeof PluginDeclarative['prototype']
        ] = v;
      }
    }

    return PluginDeclarative as unknown as ToolConstructable;
  } else {
    return class {} as unknown as ToolConstructable;
  }
};

export const stringToHtmlElement = (str: string) => {
  const element = document.createElement('div');
  element.innerHTML = str;
  return element.firstElementChild;
};
