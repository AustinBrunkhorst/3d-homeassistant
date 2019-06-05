/// <reference types="react-scripts" />

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

declare module "*.fbx" {
  const publicPath: string;

  export default publicPath;
}
