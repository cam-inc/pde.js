import { PDJSXVNodeType } from './types';

export const emptyVNode: {
  [K in PDJSXVNodeType]: null;
} = {
  tool: null,
  inlineTool: null,
  blockTune: null,
} as const;

export const pluginMethodPrefixes = {
  STATIC_GETTER: 'static_get_',
  STATIC_METHOD: 'static_',
  CONSTRUCTOR: 'initializer',
  UNSTABLE_METHODS: {
    /**
     * @description We strongly suggest to use BlockTune API instead of.
     */
    RENDER_SETTINGS: 'renderSettings',
  },
} as const;
