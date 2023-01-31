import { settings } from "@vendetta";
import { connectToDebugger } from "@vendetta/debug";
import { ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";

export default () => {
  // this is only run once since you'd permanently have the annoying toasts if it didn't
  if (storage.autoDebugger)
    connectToDebugger(settings.debuggerUrl)

  if (storage.autoRDC && window.__vendetta_rdc) {
    window.__vendetta_rdc.connectToDevTools({
      host: settings.debuggerUrl.split(":")[0],
      resolveRNStyle: ReactNative.StyleSheet.flatten,
    });
  }
}
