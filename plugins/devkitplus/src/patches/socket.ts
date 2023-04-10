import { settings } from "@vendetta";
import { connectToDebugger } from "@vendetta/debug";
import { ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";

export const rdcProp = window.__vendetta_loader?.features.devtools?.prop;

export default () => {
  // this is only run once since you'd permanently have the annoying toasts if it didn't
  if (storage.autoDebugger && settings.debuggerUrl)
    connectToDebugger(settings.debuggerUrl)


  if (storage.autoRDC && window[rdcProp]) {
    window[rdcProp].connectToDevTools({
      host: settings.debuggerUrl.split(":")[0],
      resolveRNStyle: ReactNative.StyleSheet.flatten,
    });
  }
}
