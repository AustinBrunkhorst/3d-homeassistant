/// <reference types="react-scripts" />

// https://github.com/Microsoft/TypeScript/issues/30471#issuecomment-474963436
declare module "console" {
  export = typeof import("console");
}

declare module "*.fbx" {
  const publicPath: string;

  export default publicPath;
}
