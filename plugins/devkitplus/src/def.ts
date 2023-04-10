export {};

declare global {
  interface Window {
    __vendetta_loader?: LoaderIdentity;
    dk: any;
  }
}
