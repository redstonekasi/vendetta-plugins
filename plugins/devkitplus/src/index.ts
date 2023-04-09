import globals from "./patches/globals";
import socket from "./patches/socket";
import window from "./patches/window";

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
