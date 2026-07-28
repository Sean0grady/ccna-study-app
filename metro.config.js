// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Zustand's package "exports" map resolves to its ESM build (esm/*.mjs) on web,
// which contains raw `import.meta.env` syntax used for dev-only deprecation warnings.
// Metro's web output is a classic (non-module) <script>, so that raw `import.meta`
// token is a SyntaxError that aborts the entire bundle before React can hydrate --
// every element on the page renders but nothing responds to clicks. Force zustand
// to resolve via its CJS build on web, where this doesn't apply.
const { resolveRequest: defaultResolveRequest } = config.resolver;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && (moduleName === 'zustand' || moduleName.startsWith('zustand/'))) {
    return (defaultResolveRequest ?? context.resolveRequest)(
      { ...context, unstable_conditionNames: ['require', 'react-native', 'default'] },
      moduleName,
      platform
    );
  }
  return (defaultResolveRequest ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
