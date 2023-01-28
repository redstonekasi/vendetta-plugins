import globals from "./globals";
import socket from "./socket";

const { storage } = vendetta.plugin;

// Some default settings
storage.assignGlobals ??= true;
storage.autoDebugger ??= true;
storage.autoRDC ??= true;

globals(storage.assignGlobals);
socket();

export const onUnload = () => {
  globals(false);
};

export { default as settings } from "./settings";
