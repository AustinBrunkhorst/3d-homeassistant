export interface Scene {
  init(): Promise<void>;

  dispose(): void;

  update(time: number): void;
  render(): void;

  onViewportResize(): void;
}

export interface SceneComponent {
  update(time: number): void;
}
