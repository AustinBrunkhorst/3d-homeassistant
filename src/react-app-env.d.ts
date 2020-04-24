/// <reference types="react-scripts" />
/// <reference types="home-assistant-js-websocket/dist/connection" />

// https://github.com/Microsoft/TypeScript/issues/30471#issuecomment-474963436
declare module "console" {
  export = typeof import("console");
}

namespace JSX {
  // TODO: remove when react-three-fiber figures this out
  interface IntrinsicElements {
    [key: string]: Optional<React.ElementType>;
  }
}

/**
 * Returns an array of all paths matching the require context
 */
function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}