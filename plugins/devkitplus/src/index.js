import globals from "./globals";
import "./socket";

const { Platform } = vendetta.metro.common.ReactNative;
const { storage } = vendetta.plugin;

// Some default settings
storage.assignGlobals ??= true;
storage.autoDebugger ??= true;
storage.autoRDC ??= Platform.OS === "android";

globals(storage.assignGlobals);

export const onUnload = () => {
  globals(false);
};

export { default as settings } from "./settings";
