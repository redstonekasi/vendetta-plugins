import globals from "./globals";
import socket from "./socket";
import window from "./window";

import { storage } from "@vendetta/plugin";

// Some default settings
storage.assignGlobals ??= true;
storage.autoDebugger ??= true;
storage.autoRDC ??= true;

globals(storage.assignGlobals);
socket();

export const onUnload = () => {
  globals(false);
  window();
};

export { default as settings } from "./settings";
