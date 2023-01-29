import { storage } from "@vendetta/plugin";

export default () => {
  // this is only run once since you'd permanently have the annoying toasts if it didn't
  if (storage.autoDebugger)
    vendetta.debug.connectToDebugger(vendetta.settings.debuggerUrl);

  if (storage.autoRDC && window.__vendetta_rdc) {
    const { StyleSheet } = vendetta.metro.common.ReactNative;

    window.__vendetta_rdc.connectToDevTools({
      host: vendetta.settings.debuggerUrl.split(":")[0],
      resolveRNStyle: StyleSheet.flatten,
    });
  }
}
